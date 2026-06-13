import type { Metadata } from 'next';
import Link from 'next/link';
import GridTool from '@/components/GridTool';
import SeoSections from '@/components/SeoSections';
import StructuredData from '@/components/StructuredData';
import { getLanguageAlternates } from '@/lib/localizedPages';
import { SITE_URL } from '@/lib/seo';

const pageUrl = `${SITE_URL}/twitter-grid-maker`;

const faqs = [
  {
    question: 'Does this still work for Twitter?',
    answer:
      'Yes. X and Twitter grid searches refer to the same post image layout, so the 2x2 splitter is built for that feed preview.',
  },
  {
    question: 'What is the custom grid illusion mode?',
    answer:
      'It is the original X-Grid workflow where one main image is combined with header and footer images to create four taller grid tiles.',
  },
  {
    question: 'Do I need exactly 9 images for custom mode?',
    answer:
      'Yes. Custom mode uses one main image plus eight header and footer images assigned across the four quadrants.',
  },
  {
    question: 'Will my images be stored?',
    answer:
      'No. The tool processes images in your browser and keeps them on your device.',
  },
];

export const metadata: Metadata = {
  title: 'Twitter Grid Maker - Create Twitter Grid Effect',
  description:
    'Free Twitter grid maker for 2x2 photo posts, custom X grid illusions, and Twitter grid effects. Split and download images privately in your browser.',
  alternates: {
    canonical: pageUrl,
    languages: getLanguageAlternates('twitter'),
  },
  keywords: [
    'Twitter grid maker',
    'Twitter photo grid',
    'X grid maker',
    'Twitter image splitter',
    'Twitter 2x2 grid',
    'create twitter grid effect',
    'Twitter grid effect',
  ],
  openGraph: {
    title: 'Twitter Grid Maker',
    description: 'Create 2x2 Twitter/X photo grids, grid effects, and custom grid illusions.',
    url: pageUrl,
    siteName: 'X-Grid',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Twitter Grid Maker',
    description: 'Split and preview Twitter/X photo grids and grid effects directly in your browser.',
  },
};

export default function TwitterGridMakerPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Twitter Grid Maker',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          url: pageUrl,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to create a Twitter photo grid',
          step: [
            'Choose X 2x2 Image Splitter or X Custom Grid Illusion.',
            'Select a local image or assign the 9 custom images.',
            'Process the images and preview the Twitter-style layout.',
            'Download the ordered JPG tiles and post them together.',
          ].map((text) => ({ '@type': 'HowToStep', text })),
        }}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <main>
        <section className="border-b bg-zinc-50">
          <div className="mx-auto max-w-6xl px-2 py-4 min-[380px]:px-3 sm:px-6 sm:py-8 lg:px-8 lg:py-14">
            <div className="mb-4 max-w-3xl sm:mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
                Twitter and X photo grid tool
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:mt-3 sm:text-5xl">
                Twitter Grid Maker
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-600 sm:mt-4 sm:text-lg sm:leading-8">
                Create a 2x2 Twitter photo grid from one image or use the advanced custom grid illusion workflow. Your images stay in your browser.
              </p>
              <Link
                href="/create-twitter-grid-effect"
                className="mt-3 inline-flex text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
              >
                Create Twitter Grid Effect
              </Link>
            </div>
            <GridTool initialMode="x-single" allowedModes={['x-single', 'x-custom']} />
          </div>
        </section>

        <SeoSections
          title="How Twitter and X display photo grids"
          intro="When you attach multiple images to a post, X creates a compact grid preview. This tool generates ordered image tiles so the preview reads as one larger visual."
          steps={[
            {
              title: 'Start with a source image',
              text: 'Use the simple splitter for one image, or choose custom mode when you want the original multi-image illusion.',
            },
            {
              title: 'Check the post preview',
              text: 'The preview shows the generated tiles in a Twitter-style 2x2 grid before you download.',
            },
            {
              title: 'Post all tiles together',
              text: 'Download the files and attach them to one post in the order shown by the filenames.',
            },
          ]}
          sections={[
            {
              title: 'Single image splitter',
              text: 'Best for posters, screenshots, banners, and images that should become one 2x2 post layout.',
            },
            {
              title: 'Custom grid illusion',
              text: 'Best when you want each opened image to show more than the cropped feed preview.',
            },
            {
              title: 'Client-side exports',
              text: 'All generated images are created with browser canvas APIs and downloaded as JPG files.',
            },
          ]}
          faqs={faqs}
        />
      </main>
    </>
  );
}
