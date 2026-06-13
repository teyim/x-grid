import GridTool from '@/components/GridTool';
import SeoSections from '@/components/SeoSections';
import StructuredData from '@/components/StructuredData';
import UsageStats from '@/components/UsageStats';
import {
  getLocalizedContent,
  getLocalizedPath,
  type PageKind,
  type SeoLocale,
} from '@/lib/localizedPages';
import { SITE_URL } from '@/lib/seo';

type LocalizedToolPageProps = {
  locale: SeoLocale;
  kind: PageKind;
};

export default function LocalizedToolPage({ locale, kind }: LocalizedToolPageProps) {
  const content = getLocalizedContent(locale, kind);
  const pageUrl = `${SITE_URL}${getLocalizedPath(locale, kind)}`;

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: content.title,
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
          mainEntity: content.faqs.map((faq) => ({
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
                {content.kicker}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:mt-3 sm:text-5xl">
                {content.heading}
              </h1>
              <p className="mt-3 text-base leading-7 text-zinc-600 sm:mt-4 sm:text-lg sm:leading-8">
                {content.body}
              </p>
            </div>
            <GridTool
              initialMode={content.initialMode}
              allowedModes={content.toolModes}
            />
          </div>
        </section>

        <UsageStats />

        <SeoSections
          title={content.seoTitle}
          intro={content.seoIntro}
          steps={content.steps}
          sections={content.sections}
          faqs={content.faqs}
        />
      </main>
    </>
  );
}
