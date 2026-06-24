import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('x-grid-maker');

export default function XGridMakerPage() {
  return <SeoLandingPage page={getLandingPage('x-grid-maker')} />;
}
