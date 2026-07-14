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

  // Blog post entries — only generate URLs for locales the post actually exists in
  for (const post of posts) {
    for (const locale of post.locales) {
      const alternates: Record<string, string> = {
        [locale]: `${baseUrl}/${locale}/blog/${post.slug}`,
        'x-default': `${baseUrl}/en/blog/${post.slug}`,
      };

      // Add other locales that this post also exists in
      for (const otherLocale of post.locales) {
        if (otherLocale !== locale) {
          alternates[otherLocale] = `${baseUrl}/${otherLocale}/blog/${post.slug}`;
        }
      }
      // Ensure en exists in alternates even if it's not a locale of this post
      // (used for x-default)
      if (!alternates['en']) {
        alternates['en'] = `${baseUrl}/en/blog/${post.slug}`;
      }

      entries.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
