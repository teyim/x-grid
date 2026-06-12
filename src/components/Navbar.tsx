'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  Grid2X2,
  Images,
  Menu,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import twitterLogo from "../../public/twitter-grid-logo.svg";
import { GITHUB_URL, X_URL } from "../lib/constants";

const navItems: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/twitter-grid-maker",
    label: "X Grid Maker",
    description: "2x2 posts and custom grid illusions",
    icon: Grid2X2,
  },
  {
    href: "/instagram-grid-maker",
    label: "Instagram Grid Maker",
    description: "3x3 grids and carousel tiles",
    icon: Images,
  },
  {
    href: "/#tool",
    label: "Create",
    description: "Open the grid generator",
    icon: Sparkles,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-1 md:flex">
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
          aria-label={open ? "Close menu" : "Open menu"}
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
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                      {item.description}
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
                X Profile
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-white text-sm font-semibold text-zinc-800"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
