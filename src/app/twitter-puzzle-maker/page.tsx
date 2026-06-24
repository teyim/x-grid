import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('twitter-puzzle-maker');

export default function TwitterPuzzleMakerPage() {
  return <SeoLandingPage page={getLandingPage('twitter-puzzle-maker')} />;
}
