'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Images, WandSparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

type UsageStatsResponse = {
  ok: boolean;
  stats?: {
    total_grids_created: number;
    total_images_transformed: number;
    total_tiles_generated: number;
    x_grids_created: number;
    instagram_grids_created: number;
  };
};

export default function UsageStats() {
  const { locale, t } = useI18n();
  const [stats, setStats] = useState<UsageStatsResponse['stats'] | null>(null);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function loadStats() {
      try {
        const response = await fetch('/api/stats', { cache: 'no-store' });
        const result = (await response.json()) as UsageStatsResponse;

        if (active && result.ok && result.stats) {
          setStats(result.stats);
        }
      } catch {
        if (active) setStats(null);
      }
    }

    const scheduleStatsLoad = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          if (active) loadStats();
        });
        return;
      }

      timeoutId = globalThis.setTimeout(loadStats, 1200);
    };

    scheduleStatsLoad();
    window.addEventListener('usage-stats-updated', loadStats);

    return () => {
      active = false;
      if (timeoutId) globalThis.clearTimeout(timeoutId);
      window.removeEventListener('usage-stats-updated', loadStats);
    };
  }, []);

  const numberFormatter = new Intl.NumberFormat(locale);
  const items = [
    {
      label: t('stats.gridsCreated'),
      value: stats?.total_grids_created,
      icon: WandSparkles,
    },
    {
      label: t('stats.imagesTransformed'),
      value: stats?.total_images_transformed,
      icon: Images,
    },
    {
      label: t('stats.tilesGenerated'),
      value: stats?.total_tiles_generated,
      icon: BarChart3,
    },
  ];

  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-4 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            {t('stats.kicker')}
          </p>
          <h2 className="mt-1 text-xl font-bold text-zinc-950 sm:text-2xl">
            {t('stats.title')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {t('stats.description')}
          </p>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex min-w-0 items-center gap-2 border-r border-zinc-200 px-2.5 py-2 last:border-r-0 sm:px-4 sm:py-3"
              >
                <span className="hidden size-8 shrink-0 items-center justify-center rounded bg-white text-zinc-800 shadow-sm min-[420px]:flex">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold tabular-nums text-zinc-950 sm:text-base">
                    {typeof item.value === 'number' ? numberFormatter.format(item.value) : '-'}
                  </span>
                  <span className="block truncate text-[10px] font-semibold uppercase text-zinc-500 sm:text-[11px]">
                    {item.label}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
