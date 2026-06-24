import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('twitter-mosaic-maker');

export default function TwitterMosaicMakerPage() {
  return <SeoLandingPage page={getLandingPage('twitter-mosaic-maker')} />;
}
