import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/adminApi';
import {
  countEvents,
  fetchRecentFeedback,
  fetchUsageCounters,
  fetchUsageEvents,
  getUsageFilters,
  sumEventField,
} from '@/lib/adminAnalytics';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession(request);
  if (unauthorized) return unauthorized;

  const filters = getUsageFilters(request.nextUrl.searchParams);
  const { events, error } = await fetchUsageEvents({ ...filters, range: 'all', startDate: null });
  const { feedback } = await fetchRecentFeedback(20);
  const { counters } = await fetchUsageCounters();

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  const now = Date.now();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const last7 = now - 7 * 24 * 60 * 60 * 1000;
  const last30 = now - 30 * 24 * 60 * 60 * 1000;
  const rangeEvents = filters.startDate
    ? events.filter((event) => new Date(event.created_at).toISOString() >= filters.startDate!)
    : events;

  return NextResponse.json({
    ok: true,
    summary: {
      totalGrids: counters.total_grids_created ?? countEvents(events, 'grid_created'),
      todayGrids: countEvents(
        events.filter((event) => new Date(event.created_at).getTime() >= todayStart.getTime()),
        'grid_created'
      ),
      last7DaysGrids: countEvents(
        events.filter((event) => new Date(event.created_at).getTime() >= last7),
        'grid_created'
      ),
      last30DaysGrids: countEvents(
        events.filter((event) => new Date(event.created_at).getTime() >= last30),
        'grid_created'
      ),
      rangeGrids: countEvents(rangeEvents, 'grid_created'),
      tilesGenerated: sumEventField(rangeEvents, 'grid_created', 'tile_count'),
      imagesTransformed: sumEventField(rangeEvents, 'grid_created', 'input_image_count'),
      totalStarted: countEvents(rangeEvents, 'tool_started'),
      downloads: countEvents(rangeEvents, 'download_started'),
      feedbackOpen: feedback.filter((item) => item.status !== 'closed').length,
      feedbackTotal: feedback.length,
    },
  });
}
