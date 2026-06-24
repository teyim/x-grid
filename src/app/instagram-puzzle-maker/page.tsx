import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('instagram-puzzle-maker');

export default function InstagramPuzzleMakerPage() {
  return <SeoLandingPage page={getLandingPage('instagram-puzzle-maker')} />;
}
