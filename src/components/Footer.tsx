'use client';

import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo.png";
import { CONTACT_EMAIL } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";
import { localizePath } from "./Navbar";

export default function Footer() {
  const { locale, t } = useI18n();

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href={localizePath('/', locale)} className="flex items-center gap-3">
            <Image src={logo} alt="X-Grid logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold text-zinc-950">X-Grid</span>
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
            <Link href={localizePath('/twitter-grid-maker', locale)} className="hover:text-zinc-950">
              {t('nav.xGrid')}
            </Link>
            <Link href={localizePath('/create-twitter-grid-effect', locale)} className="hover:text-zinc-950">
              {t('nav.twitterEffect')}
            </Link>
            <Link href={localizePath('/instagram-grid-maker', locale)} className="hover:text-zinc-950">
              {t('nav.instagram')}
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-zinc-950">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-zinc-500">
          {t('footer.description')}
        </p>
      </div>
    </footer>
  );
}
