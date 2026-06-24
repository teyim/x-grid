import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('instagram-grid-layout');

export default function InstagramGridLayoutPage() {
  return <SeoLandingPage page={getLandingPage('instagram-grid-layout')} />;
}
