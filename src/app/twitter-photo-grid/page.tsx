import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('twitter-photo-grid');

export default function TwitterPhotoGridPage() {
  return <SeoLandingPage page={getLandingPage('twitter-photo-grid')} />;
}
