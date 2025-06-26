import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PostHogProvider } from "./providers";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-grid",
  description: "Create 2x2 grid illusion for your twitter post",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-mono`}
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
