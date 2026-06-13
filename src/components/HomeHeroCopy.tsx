'use client';

import { useI18n } from '@/lib/i18n';

export default function HomeHeroCopy() {
  const { t } = useI18n();

  return (
    <div className="mx-auto mb-6 max-w-5xl text-center sm:mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
        {t('hero.kicker')}
      </p>
      <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-zinc-950 sm:text-6xl">
        {t('hero.titleA')} <span className="text-[#f54e00]">{t('hero.titleB')}</span>
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-7 text-zinc-700 sm:text-xl">
        {t('hero.subtitle')}
      </p>
    </div>
  );
}
