import type { Metadata } from 'next';
import GridTool from '@/components/GridTool';
import SeoSections from '@/components/SeoSections';
import StructuredData from '@/components/StructuredData';
import { getLanguageAlternates } from '@/lib/localizedPages';
import { SITE_URL } from '@/lib/seo';

const pageUrl = `${SITE_URL}/instagram-grid-maker`;

const faqs = [
  {
    question: 'How do I split a photo into a 3x3 Instagram grid?',
    answer:
      'Select one local image, choose Instagram 3x3 Grid Maker, process it, then download the nine square tiles.',
  },
  {
    question: 'What order should I post Instagram grid tiles?',
    answer:
      'For a profile grid, publish tile 09 first and tile 01 last so the final profile view lines up correctly.',
  },
  {
    question: 'Can I make Instagram carousel slides?',
    answer:
      'Yes. Choose Instagram Carousel Splitter to divide one wide image into square carousel slides.',
  },
  {
    question: 'Do my Instagram images stay private?',
    answer:
      'Yes. The splitter runs in your browser and keeps your images on your device.',
  },
];

export const metadata: Metadata = {
  title: 'Instagram Grid Maker - Split Photos into 3x3 Grid Posts',
  description:
    'Free Instagram grid maker and carousel splitter. Split one photo into a 3x3 profile grid or square carousel slides directly in your browser.',
  alternates: {
    canonical: pageUrl,
    languages: getLanguageAlternates('instagram'),
  },
  keywords: [
    'Instagram grid maker',
    'Instagram 3x3 grid',
    'Instagram photo splitter',
    'Instagram carousel splitter',
    'split image for Instagram',
  ],
  openGraph: {
    title: 'Instagram Grid Maker',
    description: 'Split photos into Instagram 3x3 grids and carousel slides in your browser.',
    url: pageUrl,
    siteName: 'X-Grid',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Instagram Grid Maker',
    description: 'Create Instagram profile grids and carousel tiles with private client-side processing.',
  },
};

export default function InstagramGridMakerPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Instagram Grid Maker',
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
          name: 'How to split a photo into an Instagram grid',
          step: [
            'Choose Instagram 3x3 Grid Maker.',
            'Select one local image and pick cover or contain.',
            'Process the image and download the nine tiles.',
            'Post tile 09 first and tile 01 last on Instagram.',
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
                Instagram image splitter
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:mt-3 sm:text-5xl">
                Instagram Grid Maker
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-600 sm:mt-4 sm:text-lg sm:leading-8">
                Turn one photo into a 3x3 Instagram profile grid or split a wide image into square carousel slides. Everything is processed in your browser.
              </p>
            </div>
            <GridTool
              initialMode="instagram-grid"
              allowedModes={['instagram-grid', 'instagram-carousel']}
            />
          </div>
        </section>

        <SeoSections
          title="How to split an image for Instagram"
          intro="Use the Instagram presets when you want square tiles for a profile grid or a swipeable carousel without opening a design app."
          steps={[
            {
              title: 'Pick the Instagram preset',
              text: 'Choose 3x3 for a profile grid or carousel for a wide image split into square slides.',
            },
            {
              title: 'Choose cover or contain',
              text: 'Cover fills every square. Contain keeps the full tile visible with white padding if needed.',
            },
            {
              title: 'Download and post',
              text: 'Use the ordered filenames to post carousel tiles left-to-right or profile tiles newest-first.',
            },
          ]}
          sections={[
            {
              title: 'Best Instagram grid size',
              text: 'The tool exports square 1080px JPG tiles, a practical size for Instagram profile grids and carousel posts.',
            },
            {
              title: 'Grid vs carousel',
              text: 'A 3x3 grid creates a profile mural across posts. A carousel keeps the visual inside one swipeable post.',
            },
            {
              title: 'Local processing',
              text: 'Your source image is handled locally by browser canvas APIs, so the site does not store your photo.',
            },
          ]}
          faqs={faqs}
        />
      </main>
    </>
  );
}
