import Image from 'next/image';
import Link from 'next/link';
import GridTool from '@/components/GridTool';
import SeoSections from '@/components/SeoSections';
import StructuredData from '@/components/StructuredData';
import UsageStats from '@/components/UsageStats';
import type { LandingPageContent } from '@/lib/landingPages';
import { SITE_URL } from '@/lib/seo';

type SeoLandingPageProps = {
  page: LandingPageContent;
};

export default function SeoLandingPage({ page }: SeoLandingPageProps) {
  const pageUrl = `${SITE_URL}/${page.slug}`;

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: page.heading,
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
          name: page.seoTitle,
          step: page.steps.map((step) => ({
            '@type': 'HowToStep',
            name: step.title,
            text: step.text,
          })),
        }}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faqs.map((faq) => ({
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
            <div className="mb-4 grid gap-6 sm:mb-8 lg:grid-cols-[1fr_340px] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-sm">
                  {page.kicker}
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:mt-3 sm:text-5xl">
                  {page.heading}
                </h1>
                <p className="mt-3 text-base leading-7 text-zinc-600 sm:mt-4 sm:text-lg sm:leading-8">
                  {page.body}
                </p>
                <a
                  href="#tool"
                  className="mt-4 inline-flex rounded-md bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  {page.ctaLabel}
                </a>
              </div>

              <figure className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <Image
                  src={page.sampleImage}
                  alt={page.sampleAlt}
                  width={680}
                  height={420}
                  className="aspect-[16/10] w-full object-cover"
                  priority
                />
                <figcaption className="border-t px-3 py-2 text-xs text-zinc-500">
                  Sample preview for {page.primaryKeyword}
                </figcaption>
              </figure>
            </div>

            <div id="tool">
              <GridTool initialMode={page.initialMode} allowedModes={page.toolModes} />
            </div>
          </div>
        </section>

        <UsageStats />

        <SeoSections
          title={page.seoTitle}
          intro={page.seoIntro}
          steps={page.steps}
          sections={page.sections}
          faqs={page.faqs}
        />

        <section className="border-t bg-white">
          <div className="mx-auto max-w-5xl px-3 py-8 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950">
              Related tools
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
