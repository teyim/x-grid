import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/adminApi';
import { fetchUsageEvents, getUsageFilters, groupBy, groupCountries } from '@/lib/adminAnalytics';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession(request);
  if (unauthorized) return unauthorized;

  const filters = getUsageFilters(request.nextUrl.searchParams);
  const { events, error } = await fetchUsageEvents(filters);

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  const gridEvents = events.filter((event) => event.event_type === 'grid_created');

  return NextResponse.json({
    ok: true,
    breakdowns: {
      platforms: groupBy(gridEvents, 'platform'),
      modes: groupBy(gridEvents, 'mode_label'),
      countries: groupCountries(gridEvents),
      routes: groupBy(gridEvents, 'route'),
    },
  });
}
