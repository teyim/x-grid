import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('instagram-carousel-maker');

export default function InstagramCarouselMakerPage() {
  return <SeoLandingPage page={getLandingPage('instagram-carousel-maker')} />;
}
