'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/logo.png";
import { CONTACT_EMAIL } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";
import { localizePath } from "./Navbar";

const twitterToolLinks = [
  { href: '/twitter-grid-maker', label: 'Twitter Grid Maker' },
  { href: '/create-twitter-grid-effect', label: 'Twitter Grid Effect' },
  { href: '/x-grid-maker', label: 'X Grid Maker' },
  { href: '/twitter-image-splitter', label: 'Twitter Image Splitter' },
  { href: '/create-twitter-grid', label: 'Create Twitter Grid' },
  { href: '/twitter-puzzle-maker', label: 'Twitter Puzzle Maker' },
  { href: '/x-banner-maker', label: 'X Banner Maker' },
  { href: '/x-profile-grid-maker', label: 'X Profile Grid Maker' },
  { href: '/split-image-for-twitter', label: 'Split Image for Twitter' },
  { href: '/split-image-for-x', label: 'Split Image for X' },
  { href: '/twitter-banner-grid', label: 'Twitter Banner Grid' },
  { href: '/twitter-mosaic-maker', label: 'Twitter Mosaic Maker' },
  { href: '/twitter-photo-grid', label: 'Twitter Photo Grid' },
  { href: '/x-photo-grid', label: 'X Photo Grid' },
];

const instagramToolLinks = [
  { href: '/instagram-grid-maker', label: 'Instagram Grid Maker' },
  { href: '/instagram-image-splitter', label: 'Instagram Image Splitter' },
  { href: '/instagram-carousel-maker', label: 'Instagram Carousel Maker' },
  { href: '/instagram-puzzle-maker', label: 'Instagram Puzzle Maker' },
  { href: '/instagram-grid-layout', label: 'Instagram Grid Layout' },
  { href: '/split-photo-for-instagram', label: 'Split Photo for Instagram' },
];

export default function Footer() {
  const { locale, t } = useI18n();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

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
        <nav
          aria-label="All social grid tools"
          className="grid gap-6 border-t border-zinc-100 pt-6 md:grid-cols-2"
        >
          <FooterLinkGroup title="X and Twitter tools" links={twitterToolLinks} />
          <FooterLinkGroup title="Instagram tools" links={instagramToolLinks} />
        </nav>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-3 grid gap-x-4 gap-y-2 text-sm text-zinc-600 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-zinc-950">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
