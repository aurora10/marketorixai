import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '@/lib/api';

const locales = ['en', 'nl'] as const;
const baseUrl = 'https://www.marketorix.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsForSitemap();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = ['', '/services', '/team', '/contact', '/blog'];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        alternates: {
          languages: {
            'en': `${baseUrl}/en${page}`,
            'nl': `${baseUrl}/nl${page}`,
            'x-default': `${baseUrl}/en${page}`,
          },
        },
      });
    }
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
