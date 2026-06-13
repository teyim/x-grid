'use client';

import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import logo from "../../public/logo.png";
import { GITHUB_URL, X_URL } from "@/lib/constants";
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
            <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X profile">
              X
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="size-5" />
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
