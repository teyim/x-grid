import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('x-profile-grid-maker');

export default function XProfileGridMakerPage() {
  return <SeoLandingPage page={getLandingPage('x-profile-grid-maker')} />;
}
