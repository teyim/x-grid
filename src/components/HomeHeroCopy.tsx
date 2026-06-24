'use client';

import { useI18n } from '@/lib/i18n';

export default function HomeHeroCopy() {
  const { t } = useI18n();

  return (
    <div className="mx-auto mb-5 max-w-5xl text-center sm:mb-7">
      <p className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 shadow-sm">
        {t('hero.kicker')}
      </p>
      <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-[1.04] text-zinc-950 sm:text-6xl">
        {t('hero.titleA')} <span className="text-[#f54e00]">{t('hero.titleB')}</span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-zinc-600 sm:text-lg sm:leading-8">
        {t('hero.subtitle')}
      </p>
    </div>
  );
}
