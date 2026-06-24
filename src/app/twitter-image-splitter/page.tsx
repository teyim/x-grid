import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('twitter-image-splitter');

export default function TwitterImageSplitterPage() {
  return <SeoLandingPage page={getLandingPage('twitter-image-splitter')} />;
}
