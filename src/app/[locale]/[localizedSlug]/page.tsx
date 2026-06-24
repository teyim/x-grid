import { notFound } from 'next/navigation';
import LocalizedToolPage from '@/components/LocalizedToolPage';
import {
  buildLocalizedMetadata,
  localizedPageSlugs,
  localizedSlugToPageKind,
  seoLocales,
  type PageKind,
  type SeoLocale,
} from '@/lib/localizedPages';

type Props = {
  params: Promise<{ locale: string; localizedSlug: string }>;
};

export function generateStaticParams() {
  return seoLocales.flatMap((locale) =>
    Object.values(localizedPageSlugs[locale] ?? {}).map((localizedSlug) => ({
      locale,
      localizedSlug,
    }))
  );
}

function getLocalizedSlugKind(locale: string, localizedSlug: string): PageKind | null {
  const decodedSlug = safelyDecodeSlug(localizedSlug);
  return localizedSlugToPageKind[`${locale}/${decodedSlug}`] ?? null;
}

function safelyDecodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, localizedSlug } = await params;

  if (!seoLocales.includes(locale as SeoLocale)) return {};

  const kind = getLocalizedSlugKind(locale, localizedSlug);
  if (!kind) return {};

  return buildLocalizedMetadata(locale as SeoLocale, kind);
}

export default async function LocalizedSlugPage({ params }: Props) {
  const { locale, localizedSlug } = await params;

  if (!seoLocales.includes(locale as SeoLocale)) notFound();

  const kind = getLocalizedSlugKind(locale, localizedSlug);
  if (!kind) notFound();

  return <LocalizedToolPage locale={locale as SeoLocale} kind={kind} />;
}
