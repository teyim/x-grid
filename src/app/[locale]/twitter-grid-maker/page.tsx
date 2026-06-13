import { notFound } from 'next/navigation';
import LocalizedToolPage from '@/components/LocalizedToolPage';
import {
  buildLocalizedMetadata,
  seoLocales,
  type SeoLocale,
} from '@/lib/localizedPages';

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return seoLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!seoLocales.includes(locale as SeoLocale)) return {};
  return buildLocalizedMetadata(locale as SeoLocale, 'twitter');
}

export default async function LocalizedTwitterPage({ params }: Props) {
  const { locale } = await params;
  if (!seoLocales.includes(locale as SeoLocale)) notFound();
  return <LocalizedToolPage locale={locale as SeoLocale} kind="twitter" />;
}
