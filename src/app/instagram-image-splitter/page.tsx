import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('instagram-image-splitter');

export default function InstagramImageSplitterPage() {
  return <SeoLandingPage page={getLandingPage('instagram-image-splitter')} />;
}
