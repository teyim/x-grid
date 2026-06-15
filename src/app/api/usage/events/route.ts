import { NextRequest, NextResponse } from 'next/server';
import { buildUsageEventRow, UsageEventPayload, validateUsagePayload } from '@/lib/usageMetadata';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { sendUsageAlertEmail } from '@/lib/usageEmail';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: 'Usage storage is not configured.' },
      { status: 500 }
    );
  }

  let payload: UsageEventPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const validation = validateUsagePayload(payload);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  if (validation.eventType === 'grid_created') {
    return NextResponse.json(
      { ok: false, error: 'Grid creations are recorded through /api/stats.' },
      { status: 400 }
    );
  }

  const row = buildUsageEventRow(request, payload, validation.eventType);
  const { error } = await supabase.from('usage_events').insert(row);

  if (error) {
    console.error('Usage event insert failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to record usage event.' },
      { status: 500 }
    );
  }

  await sendUsageAlertEmail(row);

  return NextResponse.json({ ok: true });
}
