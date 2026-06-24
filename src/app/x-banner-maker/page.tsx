import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('x-banner-maker');

export default function XBannerMakerPage() {
  return <SeoLandingPage page={getLandingPage('x-banner-maker')} />;
}
