import Image from "next/image";
import Link from "next/link";
import twitterLogo from "../../public/twitter-grid-logo.svg"
import { GITHUB_URL, X_URL } from "../lib/constants";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-3 border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image src={twitterLogo} alt="Twitter Grid Logo" className="h-10 w-10" />
        </Link>
        <span className="font-bold text-xl tracking-tight">Twitter Grid Maker</span>
      </div>
      <div className="flex items-center gap-4">
        <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.53 3H21.5l-7.19 8.21L22.5 21h-6.56l-5.18-6.18L4.47 21H0.5l7.67-8.76L1 3h6.68l4.74 5.66L17.53 3zm-1.13 15h2.02l-5.47-6.53-1.6-1.91L4.61 5h-2l5.47 6.53 1.6 1.91L16.4 18z" fill="#000"/></svg>
        </a>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 7.43c.85.004 1.71.12 2.51.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .26.18.59.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" fill="#000"/></svg>
        </a>
      </div>
    </nav>
  );
} 