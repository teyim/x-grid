import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/adminApi';
import { fetchRecentFeedback, fetchUsageEvents, getUsageFilters } from '@/lib/adminAnalytics';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApiSession(request);
  if (unauthorized) return unauthorized;

  const filters = getUsageFilters(request.nextUrl.searchParams);
  const { events, error } = await fetchUsageEvents(filters, 50);
  const { feedback, error: feedbackError } = await fetchRecentFeedback(8);

  if (error) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    recent: events.slice(0, 25),
    feedback,
    feedbackError,
  });
}
