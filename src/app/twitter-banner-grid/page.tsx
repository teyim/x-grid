import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('twitter-banner-grid');

export default function TwitterBannerGridPage() {
  return <SeoLandingPage page={getLandingPage('twitter-banner-grid')} />;
}
