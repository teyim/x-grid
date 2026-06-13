import type { Metadata } from 'next';
import Link from 'next/link';
import GridTool from '@/components/GridTool';
import SeoSections from '@/components/SeoSections';
import StructuredData from '@/components/StructuredData';
import { getLanguageAlternates } from '@/lib/localizedPages';
import { SITE_URL } from '@/lib/seo';

const pageUrl = `${SITE_URL}/create-twitter-grid-effect`;

const faqs = [
  {
    question: 'How do I create a Twitter grid effect?',
    answer:
      'Choose the X 2x2 splitter for a fast grid effect, upload one image, preview the layout, then download the four image tiles for one Twitter/X post.',
  },
  {
    question: 'Can I create a Twitter grid effect from one image?',
    answer:
      'Yes. The single-image mode splits one image into four tiles that work as a 2x2 Twitter/X grid effect.',
  },
  {
    question: 'What is the 9-image Twitter grid effect?',
    answer:
      'The custom mode uses one shared main image plus header and footer images to create the original X-Grid illusion with taller opened images.',
  },
  {
    question: 'Are my images uploaded to a server?',
    answer:
      'No. The Twitter grid effect is created in your browser with client-side canvas processing.',
  },
];

export const metadata: Metadata = {
  title: 'Create Twitter Grid Effect - Free X Grid Maker',
  description:
    'Create a Twitter grid effect online. Split images for X/Twitter posts, preview the layout, and download grid tiles privately in your browser.',
  alternates: {
    canonical: pageUrl,
    languages: getLanguageAlternates('effect'),
  },
  keywords: [
    'create twitter grid effect',
    'twitter grid effect',
    'create twitter grid',
    'twitter image grid effect',
    'X grid effect',
    'Twitter grid maker',
  ],
  openGraph: {
    title: 'Create Twitter Grid Effect',
    description:
      'Make a Twitter/X grid effect from one image or build a custom 9-image grid illusion.',
    url: pageUrl,
    siteName: 'X-Grid',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Create Twitter Grid Effect',
    description:
      'Split images into Twitter/X grid tiles privately in your browser.',
  },
};

export default function CreateTwitterGridEffectPage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Create Twitter Grid Effect',
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
          name: 'How to create a Twitter grid effect',
          step: [
            'Choose X 2x2 Image Splitter or X Custom Grid Illusion.',
            'Upload one image or select 9 images for custom mode.',
            'Preview the Twitter grid effect in the tool.',
            'Download the ordered image tiles and attach them to one Twitter/X post.',
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
                Twitter and X grid effect tool
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:mt-3 sm:text-5xl">
                Create Twitter Grid Effect
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-600 sm:mt-4 sm:text-lg sm:leading-8">
                Make a Twitter/X grid effect from one image or build the custom 9-image grid illusion. The tool runs privately in your browser.
              </p>
              <Link
                href="/twitter-grid-maker"
                className="mt-3 inline-flex text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
              >
                Also see the Twitter Grid Maker page
              </Link>
            </div>
            <GridTool initialMode="x-single" allowedModes={['x-single', 'x-custom']} />
          </div>
        </section>

        <SeoSections
          title="Create a Twitter grid effect online"
          intro="This page targets the exact Twitter grid effect workflow: split an image, check the Twitter/X-style preview, and download the tiles in the right order."
          steps={[
            {
              title: 'Choose the effect',
              text: 'Use X 2x2 for a fast one-image grid effect or X Custom for the 9-image illusion workflow.',
            },
            {
              title: 'Preview before posting',
              text: 'The browser preview helps you check crop, order, and how the grid will appear in the feed.',
            },
            {
              title: 'Download the tiles',
              text: 'Save the generated JPG files and attach them together to one Twitter/X post.',
            },
          ]}
          sections={[
            {
              title: 'One-image grid effect',
              text: 'The simplest way to create a Twitter grid effect is to split one image into four 2x2 tiles.',
            },
            {
              title: '9-image grid illusion',
              text: 'Custom mode creates four taller images from a shared main image plus header and footer images.',
            },
            {
              title: 'Private processing',
              text: 'All image splitting happens locally in your browser; the source image is not uploaded.',
            },
          ]}
          faqs={faqs}
        />
      </main>
    </>
  );
}
