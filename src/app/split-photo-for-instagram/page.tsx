import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('split-photo-for-instagram');

export default function SplitPhotoForInstagramPage() {
  return <SeoLandingPage page={getLandingPage('split-photo-for-instagram')} />;
}
