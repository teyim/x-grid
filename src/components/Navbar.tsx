'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  Grid2X2,
  Images,
  Languages,
  Menu,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import twitterLogo from "../../public/twitter-grid-logo.svg";
import { GITHUB_URL, X_URL } from "../lib/constants";
import { getLocaleLabel, supportedLocales, useI18n, type Locale } from "@/lib/i18n";

const navItems: {
  href: string;
  labelKey: 'nav.xGrid' | 'nav.twitterEffect' | 'nav.instagram' | 'nav.create';
  descriptionKey: 'platform.xDesc' | 'mode.xCustomDesc' | 'platform.instagramDesc' | 'nav.create';
  icon: LucideIcon;
}[] = [
  {
    href: "/twitter-grid-maker",
    labelKey: "nav.xGrid",
    descriptionKey: "platform.xDesc",
    icon: Grid2X2,
  },
  {
    href: "/create-twitter-grid-effect",
    labelKey: "nav.twitterEffect",
    descriptionKey: "mode.xCustomDesc",
    icon: Sparkles,
  },
  {
    href: "/instagram-grid-maker",
    labelKey: "nav.instagram",
    descriptionKey: "platform.instagramDesc",
    icon: Images,
  },
  {
    href: "/#tool",
    labelKey: "nav.create",
    descriptionKey: "nav.create",
    icon: Sparkles,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-md text-zinc-950 transition hover:opacity-80"
          aria-label="X-Grid home"
          onClick={closeMenu}
        >
          <Image
            src={twitterLogo}
            alt=""
            className="size-8 shrink-0"
            priority
          />
          <span className="font-bold tracking-tight">X-Grid</span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                <Icon className="size-4" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-1 md:flex">
          <LanguageSelect locale={locale} setLocale={setLocale} label={t('language')} />
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open X profile"
            className="inline-flex size-9 items-center justify-center rounded-md text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            <ExternalLink className="size-4" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub repository"
            className="inline-flex size-9 items-center justify-center rounded-md text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            <Github className="size-4" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="ml-auto inline-flex size-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-800 transition hover:bg-zinc-100 md:hidden"
          aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-zinc-200 bg-white md:hidden">
          <nav className="mx-auto max-w-6xl space-y-1 px-3 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-md border border-zinc-100 bg-zinc-50 px-3 py-3 text-left transition hover:border-zinc-200 hover:bg-white"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white text-zinc-800">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-zinc-950">
                      {t(item.labelKey)}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                      {t(item.descriptionKey)}
                    </span>
                  </span>
                </Link>
              );
            })}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={X_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-white text-sm font-semibold text-zinc-800"
              >
                <ExternalLink className="size-4" />
                {t('nav.xProfile')}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-white text-sm font-semibold text-zinc-800"
              >
                <Github className="size-4" />
                {t('nav.github')}
              </a>
            </div>
            <LanguageSelect locale={locale} setLocale={setLocale} label={t('language')} mobile />
          </nav>
        </div>
      )}
    </header>
  );
}

function LanguageSelect({
  locale,
  setLocale,
  label,
  mobile,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  label: string;
  mobile?: boolean;
}) {
  return (
    <label className={mobile ? 'mt-2 flex items-center gap-2 text-sm font-semibold text-zinc-700' : 'flex items-center gap-1 text-sm font-semibold text-zinc-700'}>
      <Languages className="size-4" />
      <span className={mobile ? 'shrink-0' : 'sr-only'}>{label}</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm font-semibold text-zinc-800 outline-none hover:bg-zinc-50"
      >
        {supportedLocales.map((item) => (
          <option key={item} value={item}>
            {getLocaleLabel(item)}
          </option>
        ))}
      </select>
    </label>
  );
}
