import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('x-photo-grid');

export default function XPhotoGridPage() {
  return <SeoLandingPage page={getLandingPage('x-photo-grid')} />;
}
