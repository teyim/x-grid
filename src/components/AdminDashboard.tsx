'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  BarChart3,
  Download,
  Globe2,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MousePointerClick,
  Route,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { GRID_MODES } from '@/lib/gridModes';
import { cn } from '@/lib/utils';

type RangeValue = '24h' | '7d' | '30d' | '90d' | 'all';

type SummaryResponse = {
  ok: boolean;
  summary?: {
    totalGrids: number;
    todayGrids: number;
    last7DaysGrids: number;
    last30DaysGrids: number;
    rangeGrids: number;
    tilesGenerated: number;
    imagesTransformed: number;
    totalStarted: number;
    downloads: number;
    feedbackOpen: number;
    feedbackTotal: number;
  };
  error?: string;
};

type TimeseriesResponse = {
  ok: boolean;
  series?: { date: string; value: number }[];
  error?: string;
};

type BreakdownItem = {
  label: string;
  value: number;
  code?: string;
};

type BreakdownsResponse = {
  ok: boolean;
  breakdowns?: {
    platforms: BreakdownItem[];
    modes: BreakdownItem[];
    countries: BreakdownItem[];
    routes: BreakdownItem[];
  };
  error?: string;
};

type UsageEvent = {
  id: string;
  created_at: string;
  event_type: 'tool_started' | 'grid_created' | 'download_started';
  platform: 'x' | 'instagram' | null;
  mode_label: string | null;
  tile_count: number | null;
  input_image_count: number | null;
  route: string | null;
  country_name: string | null;
};

type FeedbackSubmission = {
  id: string;
  created_at: string;
  type: string;
  option: string;
  rating: number | null;
  status: string;
  route: string | null;
};

type RecentResponse = {
  ok: boolean;
  recent?: UsageEvent[];
  feedback?: FeedbackSubmission[];
  error?: string;
};

const ranges: { value: RangeValue; label: string }[] = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'all', label: 'All' },
];

const numberFormatter = new Intl.NumberFormat('en');

export default function AdminDashboard() {
  const router = useRouter();
  const [range, setRange] = useState<RangeValue>('30d');
  const [platform, setPlatform] = useState('all');
  const [mode, setMode] = useState('all');
  const [country, setCountry] = useState('');
  const [route, setRoute] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryResponse['summary'] | null>(null);
  const [series, setSeries] = useState<TimeseriesResponse['series']>([]);
  const [breakdowns, setBreakdowns] = useState<BreakdownsResponse['breakdowns'] | null>(null);
  const [recent, setRecent] = useState<UsageEvent[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({ range });
    if (platform !== 'all') params.set('platform', platform);
    if (mode !== 'all') params.set('mode', mode);
    if (country.trim()) params.set('country', country.trim().toUpperCase());
    if (route.trim()) params.set('route', route.trim());
    return params.toString();
  }, [country, mode, platform, range, route]);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [summaryResult, timeseriesResult, breakdownsResult, recentResult] = await Promise.all([
          fetchJson<SummaryResponse>(`/api/admin/usage/summary?${queryString}`),
          fetchJson<TimeseriesResponse>(`/api/admin/usage/timeseries?${queryString}`),
          fetchJson<BreakdownsResponse>(`/api/admin/usage/breakdowns?${queryString}`),
          fetchJson<RecentResponse>(`/api/admin/usage/recent?${queryString}`),
        ]);

        if (!active) return;

        if (!summaryResult.ok) throw new Error(summaryResult.error || 'Unable to load summary.');
        if (!timeseriesResult.ok) throw new Error(timeseriesResult.error || 'Unable to load trend.');
        if (!breakdownsResult.ok) throw new Error(breakdownsResult.error || 'Unable to load breakdowns.');
        if (!recentResult.ok) throw new Error(recentResult.error || 'Unable to load recent activity.');

        setSummary(summaryResult.summary || null);
        setSeries(timeseriesResult.series || []);
        setBreakdowns(breakdownsResult.breakdowns || null);
        setRecent(recentResult.recent || []);
        setFeedback(recentResult.feedback || []);
      } catch (caughtError) {
        if (active) {
          setError(caughtError instanceof Error ? caughtError.message : 'Unable to load dashboard.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [queryString]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden border-r border-zinc-200 bg-white lg:block">
          <div className="flex h-14 items-center gap-2 border-b border-zinc-200 px-4">
            <span className="flex size-8 items-center justify-center rounded-md bg-zinc-950 text-white">
              <Grid2X2 className="size-4" />
            </span>
            <span className="text-sm font-semibold">X-Grid Admin</span>
          </div>
          <nav className="space-y-1 p-3 text-sm">
            <Link className="flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 font-medium text-zinc-950" href="/admin">
              <LayoutDashboard className="size-4" />
              Usage
            </Link>
            <a className="flex items-center gap-2 rounded-md px-3 py-2 text-zinc-600" href="#feedback">
              <MessageSquare className="size-4" />
              Feedback
            </a>
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
            <div className="flex min-h-14 flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
              <div>
                <p className="text-xs font-medium uppercase text-zinc-500">Private dashboard</p>
                <h1 className="text-lg font-semibold">Basic usage dashboard</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ranges.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRange(item.value)}
                    className={cn(
                      'h-8 rounded-md border px-3 text-sm font-medium transition',
                      range === item.value
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
                <Button type="button" variant="outline" onClick={logout} className="h-8">
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </div>
            </div>
          </header>

          <div className="space-y-4 p-4 lg:p-6">
            <Filters
              platform={platform}
              mode={mode}
              country={country}
              route={route}
              onPlatform={setPlatform}
              onMode={setMode}
              onCountry={setCountry}
              onRoute={setRoute}
            />

            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total grids" value={summary?.totalGrids} icon={Grid2X2} loading={loading} />
              <MetricCard title="Today" value={summary?.todayGrids} icon={Activity} loading={loading} />
              <MetricCard title="7 days" value={summary?.last7DaysGrids} icon={BarChart3} loading={loading} />
              <MetricCard title="30 days" value={summary?.last30DaysGrids} icon={Users} loading={loading} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard title="Total started" value={summary?.totalStarted} icon={MousePointerClick} loading={loading} />
              <MetricCard title="Downloads" value={summary?.downloads} icon={Download} loading={loading} />
              <MetricCard title="Tiles generated" value={summary?.tilesGenerated} icon={Grid2X2} loading={loading} />
              <MetricCard title="Images transformed" value={summary?.imagesTransformed} icon={Activity} loading={loading} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)]">
              <Panel title="Grid creation trend" icon={BarChart3}>
                <LineChart data={series || []} loading={loading} />
              </Panel>
              <Panel title="Usage totals" icon={MousePointerClick}>
                <UsageTotals summary={summary} loading={loading} />
              </Panel>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <BreakdownPanel title="Platforms" icon={Grid2X2} items={breakdowns?.platforms || []} loading={loading} />
              <BreakdownPanel title="Modes" icon={Activity} items={breakdowns?.modes || []} loading={loading} />
              <BreakdownPanel title="Countries" icon={Globe2} items={breakdowns?.countries || []} loading={loading} />
            </div>

            <div className="grid gap-4 xl:grid-cols-1">
              <BreakdownPanel title="Top routes" icon={Route} items={breakdowns?.routes || []} loading={loading} />
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
              <Panel title="Recent activity" icon={Activity}>
                <RecentTable events={recent} loading={loading} />
              </Panel>
              <Panel title="Recent feedback" icon={MessageSquare} id="feedback">
                <FeedbackList feedback={feedback} loading={loading} openCount={summary?.feedbackOpen} />
              </Panel>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Filters({
  platform,
  mode,
  country,
  route,
  onPlatform,
  onMode,
  onCountry,
  onRoute,
}: {
  platform: string;
  mode: string;
  country: string;
  route: string;
  onPlatform: (value: string) => void;
  onMode: (value: string) => void;
  onCountry: (value: string) => void;
  onRoute: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm md:grid-cols-4">
      <Select label="Platform" value={platform} onChange={onPlatform}>
        <option value="all">All platforms</option>
        <option value="x">X</option>
        <option value="instagram">Instagram</option>
      </Select>
      <Select label="Mode" value={mode} onChange={onMode}>
        <option value="all">All modes</option>
        {GRID_MODES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.shortLabel}
          </option>
        ))}
      </Select>
      <TextFilter label="Country" value={country} placeholder="US" onChange={onCountry} />
      <TextFilter label="Route" value={route} placeholder="/twitter-grid-maker" onChange={onRoute} />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="min-w-0 text-xs font-medium uppercase text-zinc-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm normal-case text-zinc-950 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
      >
        {children}
      </select>
    </label>
  );
}

function TextFilter({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="min-w-0 text-xs font-medium uppercase text-zinc-500">
      {label}
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm normal-case text-zinc-950 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
      />
    </label>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value?: number | string;
  icon: LucideIcon;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <Icon className="size-4 text-zinc-500" />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums">
        {loading ? '-' : typeof value === 'number' ? numberFormatter.format(value) : value ?? '-'}
      </p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  id,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="flex h-12 items-center gap-2 border-b border-zinc-200 px-4">
        <Icon className="size-4 text-zinc-500" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function LineChart({ data, loading }: { data: { date: string; value: number }[]; loading: boolean }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = data.length <= 1 ? 0 : (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / max) * 88 - 6;
    return `${x},${y}`;
  });

  if (loading) return <div className="h-64 animate-pulse rounded-md bg-zinc-100" />;

  if (!data.length) {
    return <div className="flex h-64 items-center justify-center text-sm text-zinc-500">No grid events yet.</div>;
  }

  return (
    <div className="h-64">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-52 w-full overflow-visible">
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="rgb(24 24 27)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((item, index) => {
          const [x, y] = points[index].split(',').map(Number);
          return <circle key={`${item.date}-${index}`} cx={x} cy={y} r="1.3" fill="rgb(234 88 12)" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between gap-3 text-xs text-zinc-500">
        <span className="truncate">{data[0]?.date}</span>
        <span className="tabular-nums">{numberFormatter.format(data.reduce((total, item) => total + item.value, 0))} grids</span>
        <span className="truncate text-right">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function UsageTotals({ summary, loading }: { summary: SummaryResponse['summary'] | null; loading: boolean }) {
  const rows = [
    { label: 'Total started', value: summary?.totalStarted || 0 },
    { label: 'Grids created', value: summary?.rangeGrids || 0 },
    { label: 'Downloads', value: summary?.downloads || 0 },
  ];
  const max = Math.max(...rows.map((item) => item.value), 1);

  if (loading) return <div className="h-64 animate-pulse rounded-md bg-zinc-100" />;

  return (
    <div className="space-y-4">
      {rows.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700">{item.label}</span>
            <span className="tabular-nums text-zinc-500">{numberFormatter.format(item.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100">
            <div className="h-2 rounded-full bg-zinc-950" style={{ width: `${Math.max((item.value / max) * 100, item.value ? 4 : 0)}%` }} />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
        <div className="rounded-md bg-zinc-50 p-3">
          <p className="text-zinc-500">Tiles</p>
          <p className="mt-1 font-semibold tabular-nums">{numberFormatter.format(summary?.tilesGenerated || 0)}</p>
        </div>
        <div className="rounded-md bg-zinc-50 p-3">
          <p className="text-zinc-500">Images</p>
          <p className="mt-1 font-semibold tabular-nums">{numberFormatter.format(summary?.imagesTransformed || 0)}</p>
        </div>
      </div>
    </div>
  );
}

function BreakdownPanel({
  title,
  icon,
  items,
  loading,
}: {
  title: string;
  icon: LucideIcon;
  items: BreakdownItem[];
  loading: boolean;
}) {
  return (
    <Panel title={title} icon={icon}>
      {loading ? (
        <div className="h-52 animate-pulse rounded-md bg-zinc-100" />
      ) : (
        <BreakdownTable items={items.slice(0, 8)} />
      )}
    </Panel>
  );
}

function BreakdownTable({ items }: { items: BreakdownItem[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  if (!items.length) return <p className="py-8 text-center text-sm text-zinc-500">No data yet.</p>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={`${item.label}-${item.code || ''}`}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-zinc-700">{item.label}</span>
            <span className="tabular-nums text-zinc-500">{numberFormatter.format(item.value)}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-zinc-100">
            <div className="h-1.5 rounded-full bg-orange-600" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentTable({ events, loading }: { events: UsageEvent[]; loading: boolean }) {
  if (loading) return <div className="h-80 animate-pulse rounded-md bg-zinc-100" />;

  if (!events.length) return <p className="py-12 text-center text-sm text-zinc-500">No recent activity.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <th className="py-2 pr-3 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Event</th>
            <th className="px-3 py-2 font-medium">Mode</th>
            <th className="px-3 py-2 font-medium">Country</th>
            <th className="px-3 py-2 font-medium">Route</th>
            <th className="py-2 pl-3 text-right font-medium">Tiles</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-zinc-100 last:border-0">
              <td className="py-2 pr-3 whitespace-nowrap text-zinc-600">{formatDate(event.created_at)}</td>
              <td className="px-3 py-2 font-medium">{formatEvent(event.event_type)}</td>
              <td className="px-3 py-2 text-zinc-600">{event.mode_label || '-'}</td>
              <td className="px-3 py-2 text-zinc-600">{event.country_name || 'Unknown'}</td>
              <td className="max-w-52 truncate px-3 py-2 text-zinc-600">{event.route || '-'}</td>
              <td className="py-2 pl-3 text-right tabular-nums text-zinc-600">{event.tile_count || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FeedbackList({
  feedback,
  loading,
  openCount,
}: {
  feedback: FeedbackSubmission[];
  loading: boolean;
  openCount?: number;
}) {
  if (loading) return <div className="h-80 animate-pulse rounded-md bg-zinc-100" />;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2 text-sm">
        <span className="text-zinc-600">Open feedback</span>
        <span className="font-semibold tabular-nums">{numberFormatter.format(openCount || 0)}</span>
      </div>
      <div className="space-y-2">
        {feedback.length ? feedback.map((item) => (
          <div key={item.id} className="rounded-md border border-zinc-200 p-3">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium capitalize">{item.type}</span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{item.status}</span>
            </div>
            <p className="mt-1 truncate text-sm text-zinc-600">{item.option.replaceAll('_', ' ')}</p>
            <p className="mt-2 text-xs text-zinc-500">{formatDate(item.created_at)} · {item.route || 'No route'}</p>
          </div>
        )) : (
          <p className="py-10 text-center text-sm text-zinc-500">No feedback yet.</p>
        )}
      </div>
    </div>
  );
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  return response.json() as Promise<T>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatEvent(value: UsageEvent['event_type']) {
  return value.replaceAll('_', ' ');
}
