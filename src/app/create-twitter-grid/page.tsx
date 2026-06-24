import type { Metadata } from 'next';
import SeoLandingPage from '@/components/SeoLandingPage';
import { getLandingMetadata, getLandingPage } from '@/lib/landingPages';

export const metadata: Metadata = getLandingMetadata('create-twitter-grid');

export default function CreateTwitterGridPage() {
  return <SeoLandingPage page={getLandingPage('create-twitter-grid')} />;
}
