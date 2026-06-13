import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { feedbackOptions, feedbackTypes, type FeedbackPayload } from '@/lib/feedback';

export const runtime = 'nodejs';

const rateLimitWindowMs = 10 * 60 * 1000;
const maxSubmissionsPerWindow = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type FeedbackRow = {
  type: string;
  option: string;
  rating: number | null;
  message: string | null;
  email: string | null;
  route: string | null;
  locale: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  posthog_distinct_id: string | null;
};

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many feedback submissions. Please try again later.' },
      { status: 429 }
    );
  }

  let payload: FeedbackPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const validation = validateFeedbackPayload(payload);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { ok: false, error: 'Feedback storage is not configured.' },
      { status: 500 }
    );
  }

  const row: FeedbackRow = {
    type: validation.data.type,
    option: validation.data.option,
    rating: validation.data.rating,
    message: validation.data.message,
    email: validation.data.email,
    route: validation.data.route,
    locale: validation.data.locale,
    user_agent: truncate(request.headers.get('user-agent'), 500),
    ip_hash: ip ? hashValue(ip) : null,
    posthog_distinct_id: validation.data.posthogDistinctId,
  };

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert(row)
      .select('id')
      .single();

    if (error) {
      console.error('Feedback insert failed:', error);
      return NextResponse.json(
        { ok: false, error: 'Unable to submit feedback right now.' },
        { status: 500 }
      );
    }

    await sendFeedbackEmail(data.id, row);

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error('Feedback submission failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to submit feedback right now.' },
      { status: 500 }
    );
  }
}

function validateFeedbackPayload(payload: FeedbackPayload):
  | { ok: true; data: Required<Pick<FeedbackPayload, 'type' | 'option'>> & {
      rating: number | null;
      message: string | null;
      email: string | null;
      route: string | null;
      locale: string | null;
      posthogDistinctId: string | null;
    } }
  | { ok: false; error: string } {
  const type = payload.type;

  if (!feedbackTypes.includes(type)) {
    return { ok: false, error: 'Choose a feedback type.' };
  }

  if (!feedbackOptions[type].includes(payload.option)) {
    return { ok: false, error: 'Choose a feedback option.' };
  }

  const rating = payload.rating ?? null;

  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    return { ok: false, error: 'Rating must be between 1 and 5.' };
  }

  const message = truncate(cleanString(payload.message), 2000);
  const email = cleanString(payload.email);

  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { ok: false, error: 'Enter a valid email address or leave it blank.' };
  }

  return {
    ok: true,
    data: {
      type,
      option: payload.option,
      rating,
      message,
      email,
      route: truncate(cleanString(payload.route), 500),
      locale: truncate(cleanString(payload.locale), 32),
      posthogDistinctId: truncate(cleanString(payload.posthogDistinctId), 128),
    },
  };
}

async function sendFeedbackEmail(id: string, row: FeedbackRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FEEDBACK_ALERT_TO;
  const from = process.env.FEEDBACK_ALERT_FROM;

  if (!apiKey || !to || !from) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `[socialgridtool] New ${row.type}: ${row.option}`,
      text: [
        `Feedback ID: ${id}`,
        `Type: ${row.type}`,
        `Option: ${row.option}`,
        `Rating: ${row.rating ?? 'Not provided'}`,
        `Route: ${row.route ?? 'Not provided'}`,
        `Locale: ${row.locale ?? 'Not provided'}`,
        `Email: ${row.email ?? 'Not provided'}`,
        '',
        'Message:',
        row.message || 'Not provided',
      ].join('\n'),
    });
  } catch (error) {
    console.error('Feedback email alert failed:', error);
  }
}

function isRateLimited(ip: string | null) {
  const key = ip || 'unknown';
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  if (current.count >= maxSubmissionsPerWindow) {
    return true;
  }

  current.count += 1;
  return false;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || request.headers.get('x-real-ip') || null;
}

function hashValue(value: string) {
  const salt = process.env.FEEDBACK_IP_SALT || 'socialgridtool-feedback';
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

function cleanString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function truncate(value: string | null, length: number) {
  if (!value) return null;
  return value.slice(0, length);
}
