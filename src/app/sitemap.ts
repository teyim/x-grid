import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getLocalizedPath, pagePaths, seoLocales, type PageKind } from '@/lib/localizedPages';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const basePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/twitter-grid-maker`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/create-twitter-grid-effect`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/instagram-grid-maker`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const localizedPages: MetadataRoute.Sitemap = seoLocales.flatMap((locale) =>
    (Object.keys(pagePaths) as PageKind[]).map((kind) => ({
      url: `${SITE_URL}${getLocalizedPath(locale, kind)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: kind === 'effect' ? 0.9 : 0.8,
    }))
  );

  return [...basePages, ...localizedPages];
}
