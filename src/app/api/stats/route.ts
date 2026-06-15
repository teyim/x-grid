import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';
import { buildUsageEventRow, cleanString, truncate } from '@/lib/usageMetadata';

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
  modeId?: string;
  modeLabel?: string;
  fitMode?: string | null;
  route?: string;
  locale?: string;
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

  const usageRow = buildUsageEventRow(
    request,
    {
      ...payload,
      eventType: 'grid_created',
      platform,
      tileCount,
      inputImageCount,
      modeId: truncate(cleanString(payload.modeId), 64) || undefined,
      modeLabel: truncate(cleanString(payload.modeLabel), 120) || undefined,
      route: truncate(cleanString(payload.route), 500) || undefined,
      locale: truncate(cleanString(payload.locale), 32) || undefined,
    },
    'grid_created'
  );

  const { error: usageError } = await supabase.from('usage_events').insert(usageRow);

  if (usageError) {
    console.error('Grid usage event insert failed:', usageError);
  }

  return NextResponse.json({ ok: true });
}

function getSupabaseClient() {
  return getSupabaseAdminClient();
}

function emptyStats(): Record<UsageMetric, number> {
  return Object.fromEntries(usageMetrics.map((metric) => [metric, 0])) as Record<UsageMetric, number>;
}
