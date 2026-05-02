import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '@/lib/api';

const locales = ['en', 'nl'] as const;
const baseUrl = 'https://www.marketorix.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsForSitemap();

  const entries: MetadataRoute.Sitemap = [];

  // Homepage and blog listing for each locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
    });

    entries.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
    });
  }

  // Blog post entries for each locale, with hreflang alternates
  for (const post of posts) {
    for (const locale of locales) {
      const otherLocale = locales.find(l => l !== locale)!;

      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        alternates: {
          languages: {
            [locale]: `${baseUrl}/${locale}/blog/${post.slug}`,
            [otherLocale]: `${baseUrl}/${otherLocale}/blog/${post.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
