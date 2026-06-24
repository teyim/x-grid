import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('split-image-for-twitter');

export default function SplitImageForTwitterPage() {
  return <SeoLandingPage page={getLandingPage('split-image-for-twitter')} />;
}
