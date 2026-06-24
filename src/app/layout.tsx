import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PostHogProvider } from "./providers";
import { Analytics } from "@vercel/analytics/next"
import { SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "X-Grid - X and Instagram Grid Maker",
    template: "%s | X-Grid",
  },
  description:
    "Create X/Twitter and Instagram photo grids in your browser with private client-side image splitting.",
  applicationName: "X-Grid",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/logo.png", sizes: "500x500", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/logo.png", sizes: "500x500", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "X-Grid",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="microsoft-clarity" strategy="lazyOnload">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "x65pcedlai");
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-x-hidden antialiased font-sans`}
      >
       
        <PostHogProvider>
        <Navbar />
        <main className="min-h-[80vh] flex flex-col">
          {children}
           <Analytics></Analytics>
        </main>
        <Footer />
        </PostHogProvider>
        
      </body>
    </html>
  );
}
