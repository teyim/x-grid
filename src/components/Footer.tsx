import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import twitterLogo from "../../public/twitter-grid-logo.svg";
import { GITHUB_URL, X_URL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src={twitterLogo} alt="X-Grid logo" className="h-8 w-8" />
            <span className="font-semibold text-zinc-950">X-Grid</span>
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
            <Link href="/twitter-grid-maker" className="hover:text-zinc-950">
              Twitter Grid Maker
            </Link>
            <Link href="/instagram-grid-maker" className="hover:text-zinc-950">
              Instagram Grid Maker
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
          Free browser-based image splitter for X/Twitter grids, Instagram 3x3 profile grids, and Instagram carousel tiles. Images stay on your device.
        </p>
      </div>
    </footer>
  );
}
