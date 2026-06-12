import type { Metadata } from 'next';
import GridTool from '@/components/GridTool';
import SeoSections from '@/components/SeoSections';
import StructuredData from '@/components/StructuredData';
import { SITE_URL } from '@/lib/seo';

const pageUrl = `${SITE_URL}/`;

const faqs = [
  {
    question: 'Is X-Grid private?',
    answer:
      'Yes. The image splitter runs in your browser, so your photos are not uploaded to a server.',
  },
  {
    question: 'Can I make Instagram grids too?',
    answer:
      'Yes. Use the Instagram grid maker page to split one image into a 3x3 profile grid or square carousel tiles.',
  },
  {
    question: 'What image formats work?',
    answer:
      'Modern browser-supported image formats such as JPG, PNG, and WebP work in the uploader.',
  },
  {
    question: 'How do I download the grid?',
    answer:
      'After processing, download each tile individually or use the download all button to save every generated image.',
  },
];

export const metadata: Metadata = {
  title: 'X and Instagram Grid Maker - Split Images for Social Posts',
  description:
    'Create X/Twitter and Instagram photo grids in your browser. Split images into X 2x2 posts, Instagram 3x3 grids, or carousel tiles with private client-side processing.',
  alternates: {
    canonical: pageUrl,
  },
  keywords: [
    'X grid maker',
    'Twitter grid maker',
    'split image for X',
    'Twitter image splitter',
    'Instagram grid maker',
    'Instagram carousel splitter',
    'photo grid maker',
  ],
  openGraph: {
    title: 'X and Instagram Grid Maker',
    description: 'Split images for X/Twitter and Instagram with a private browser-based grid maker.',
    url: pageUrl,
    siteName: 'X-Grid',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'X and Instagram Grid Maker',
    description: 'Create X/Twitter and Instagram photo grids directly in your browser.',
  },
};

export default function Home() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'X-Grid',
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
          <div className="mx-auto max-w-6xl px-2 py-3 min-[380px]:px-3 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-3 flex min-w-0 flex-col gap-3 sm:mb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Free browser grid maker
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                  X and Instagram Grid Maker
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">
                  Switch between X/Twitter and Instagram, preview the layout, and download ready-to-post tiles. Images stay on your device.
                </p>
              </div>
            </div>
            <GridTool initialMode="x-single" />
          </div>
        </section>

        <SeoSections
          title="How to create an X photo grid"
          intro="X-Grid is built for quick image splitting: choose a preset, process the image locally, then post the generated tiles in the order shown by the preview."
          steps={[
            {
              title: 'Choose a grid mode',
              text: 'Use the 2x2 splitter for one image or the custom illusion mode for the original 9-image workflow.',
            },
            {
              title: 'Upload and preview',
              text: 'The tool processes your image in the browser and shows an X-style post preview before you download.',
            },
            {
              title: 'Download the tiles',
              text: 'Save every generated JPG with ordered filenames so the grid is easy to post.',
            },
          ]}
          sections={[
            {
              title: 'Private by design',
              text: 'Canvas processing happens on your device. There are no accounts, uploads, storage buckets, or server-side image jobs.',
            },
            {
              title: 'X 2x2 layout',
              text: 'The default mode creates four landscape tiles that match the common X image grid preview.',
            },
            {
              title: 'More social grids',
              text: 'Need a 3x3 Instagram profile grid or carousel split? Use the Instagram grid maker for square exports.',
            },
          ]}
          faqs={faqs}
        />
      </main>
    </>
  );
}
