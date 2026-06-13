import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

type UsageMetric =
  | 'total_grids_created'
  | 'total_images_transformed'
  | 'total_tiles_generated'
  | 'x_grids_created'
  | 'instagram_grids_created';

const usageMetrics: UsageMetric[] = [
  'total_grids_created',
  'total_images_transformed',
  'total_tiles_generated',
  'x_grids_created',
  'instagram_grids_created',
];

type StatsPayload = {
  platform?: string;
  tileCount?: number;
  inputImageCount?: number;
};

export async function GET() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ ok: true, stats: emptyStats() });
  }

  const { data, error } = await supabase
    .from('usage_counters')
    .select('metric,value')
    .in('metric', usageMetrics);

  if (error) {
    console.error('Usage stats fetch failed:', error);
    return NextResponse.json({ ok: true, stats: emptyStats() });
  }

  return NextResponse.json({
    ok: true,
    stats: Object.fromEntries(
      usageMetrics.map((metric) => [
        metric,
        Number(data?.find((item) => item.metric === metric)?.value || 0),
      ])
    ),
  });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: 'Usage stats storage is not configured.' },
      { status: 500 }
    );
  }

  let payload: StatsPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const platform = payload.platform;
  const tileCount = payload.tileCount;
  const inputImageCount = payload.inputImageCount;

  if (platform !== 'x' && platform !== 'instagram') {
    return NextResponse.json({ ok: false, error: 'Invalid platform.' }, { status: 400 });
  }

  if (typeof tileCount !== 'number' || !Number.isInteger(tileCount) || tileCount < 1 || tileCount > 100) {
    return NextResponse.json({ ok: false, error: 'Invalid tile count.' }, { status: 400 });
  }

  if (
    typeof inputImageCount !== 'number' ||
    !Number.isInteger(inputImageCount) ||
    inputImageCount < 1 ||
    inputImageCount > 100
  ) {
    return NextResponse.json({ ok: false, error: 'Invalid image count.' }, { status: 400 });
  }

  const { error } = await supabase.rpc('record_grid_usage', {
    platform_value: platform,
    tile_count_value: tileCount,
    input_image_count_value: inputImageCount,
  });

  if (error) {
    console.error('Usage stats record failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Unable to record usage stats.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

function emptyStats(): Record<UsageMetric, number> {
  return Object.fromEntries(usageMetrics.map((metric) => [metric, 0])) as Record<UsageMetric, number>;
}
