import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';

export type UsageEvent = {
  id: string;
  created_at: string;
  event_type: 'tool_started' | 'grid_created' | 'download_started';
  platform: 'x' | 'instagram' | null;
  mode_id: string | null;
  mode_label: string | null;
  tile_count: number | null;
  input_image_count: number | null;
  fit_mode: 'cover' | 'contain' | null;
  route: string | null;
  locale: string | null;
  country_code: string | null;
  country_name: string | null;
};

export type UsageFilters = {
  range: '24h' | '7d' | '30d' | '90d' | 'all';
  startDate: string | null;
  platform: string | null;
  mode: string | null;
  country: string | null;
  route: string | null;
};

export type FeedbackSubmission = {
  id: string;
  created_at: string;
  type: string;
  option: string;
  rating: number | null;
  status: string;
  route: string | null;
};

const validRanges = ['24h', '7d', '30d', '90d', 'all'] as const;

export function getUsageFilters(searchParams: URLSearchParams): UsageFilters {
  const rawRange = searchParams.get('range');
  const range = validRanges.find((item) => item === rawRange) || '30d';

  return {
    range,
    startDate: getStartDate(range),
    platform: cleanFilter(searchParams.get('platform')),
    mode: cleanFilter(searchParams.get('mode')),
    country: cleanFilter(searchParams.get('country')),
    route: cleanFilter(searchParams.get('route')),
  };
}

export async function fetchUsageEvents(filters: UsageFilters, limit = 5000) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { events: [] as UsageEvent[], error: 'Supabase is not configured.' };
  }

  let query = supabase
    .from('usage_events')
    .select(
      'id,created_at,event_type,platform,mode_id,mode_label,tile_count,input_image_count,fit_mode,route,locale,country_code,country_name'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (filters.startDate) query = query.gte('created_at', filters.startDate);
  if (filters.platform) query = query.eq('platform', filters.platform);
  if (filters.mode) query = query.eq('mode_id', filters.mode);
  if (filters.country) query = query.eq('country_code', filters.country);
  if (filters.route) query = query.eq('route', filters.route);

  const { data, error } = await query;

  if (error) {
    console.error('Admin usage fetch failed:', error);
    return { events: [] as UsageEvent[], error: 'Unable to load usage events.' };
  }

  return { events: (data || []) as UsageEvent[], error: null };
}

export async function fetchRecentFeedback(limit = 6) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { feedback: [] as FeedbackSubmission[], error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase
    .from('feedback_submissions')
    .select('id,created_at,type,option,rating,status,route')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Admin feedback fetch failed:', error);
    return { feedback: [] as FeedbackSubmission[], error: 'Unable to load feedback.' };
  }

  return { feedback: (data || []) as FeedbackSubmission[], error: null };
}

export async function fetchUsageCounters() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { counters: {} as Record<string, number>, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase.from('usage_counters').select('metric,value');

  if (error) {
    console.error('Admin usage counter fetch failed:', error);
    return { counters: {} as Record<string, number>, error: 'Unable to load usage counters.' };
  }

  return {
    counters: Object.fromEntries((data || []).map((item) => [item.metric, Number(item.value || 0)])),
    error: null,
  };
}

export function countEvents(events: UsageEvent[], eventType: UsageEvent['event_type']) {
  return events.filter((event) => event.event_type === eventType).length;
}

export function sumEventField(
  events: UsageEvent[],
  eventType: UsageEvent['event_type'],
  field: 'tile_count' | 'input_image_count'
) {
  return events.reduce((total, event) => {
    if (event.event_type !== eventType) return total;
    return total + (event[field] || 0);
  }, 0);
}

export function groupBy(events: UsageEvent[], field: keyof UsageEvent, fallback = 'Unknown') {
  const groups = new Map<string, number>();

  events.forEach((event) => {
    const key = String(event[field] || fallback);
    groups.set(key, (groups.get(key) || 0) + 1);
  });

  return Array.from(groups.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value);
}

export function groupCountries(events: UsageEvent[]) {
  const groups = new Map<string, { label: string; code: string; value: number }>();

  events.forEach((event) => {
    const code = event.country_code || 'Unknown';
    const current = groups.get(code) || {
      code,
      label: event.country_name || code,
      value: 0,
    };

    current.value += 1;
    groups.set(code, current);
  });

  return Array.from(groups.values()).sort((left, right) => right.value - left.value);
}

export function getDailySeries(events: UsageEvent[], range: UsageFilters['range']) {
  const gridEvents = events.filter((event) => event.event_type === 'grid_created');
  const buckets = new Map<string, number>();

  gridEvents.forEach((event) => {
    const date = new Date(event.created_at);
    const key = range === '24h'
      ? `${date.getHours().toString().padStart(2, '0')}:00`
      : date.toISOString().slice(0, 10);

    buckets.set(key, (buckets.get(key) || 0) + 1);
  });

  return Array.from(buckets.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((left, right) => left.date.localeCompare(right.date));
}

function getStartDate(range: UsageFilters['range']) {
  if (range === 'all') return null;

  const now = Date.now();
  const durations: Record<Exclude<UsageFilters['range'], 'all'>, number> = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
    '90d': 90 * 24 * 60 * 60 * 1000,
  };

  return new Date(now - durations[range]).toISOString();
}

function cleanFilter(value: string | null) {
  if (!value || value === 'all') return null;
  return value.slice(0, 500);
}
