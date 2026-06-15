import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/adminApi';
import { fetchUsageEvents, getDailySeries, getUsageFilters } from '@/lib/adminAnalytics';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession(request);
  if (unauthorized) return unauthorized;

  const filters = getUsageFilters(request.nextUrl.searchParams);
  const { events, error } = await fetchUsageEvents(filters);

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    series: getDailySeries(events, filters.range),
  });
}
