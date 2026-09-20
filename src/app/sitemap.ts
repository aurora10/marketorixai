import { MetadataRoute } from 'next';
import { getAllPostsForSitemap } from '@/lib/api';
import { DEFAULT_LOCALE, LOCALES, languageAlternates, localeUrl } from '@/lib/site';

/**
 * Frozen once per server process (i.e. once per deployment).
 *
 * This used to be `new Date()` inside the request handler, so `lastmod`
 * changed on every single crawl. Google uses lastmod to schedule recrawls and
 * discounts it site-wide when it proves unreliable, so a stable value is
 * strictly better than a fresh one. Blog posts keep their real `updatedAt`.
 */
const BUILD_TIME = new Date();

const STATIC_PAGES = ['', '/services', '/team', '/contact', '/blog'];

/**
 * Falls back to the deployment time when Strapi reports no usable updatedAt,
 * so a missing value can never emit an invalid <lastmod>.
 */
function lastModifiedOrBuildTime(value: string): Date {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? BUILD_TIME : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsForSitemap();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      entries.push({
        url: localeUrl(locale, page),
        lastModified: BUILD_TIME,
        alternates: { languages: languageAlternates(page) },
      });
    }
  }

  // Blog post entries — only advertise hreflang targets that actually exist,
  // so the sitemap never points at a 404 translation.
  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    const available = LOCALES.filter((locale) => post.locales.includes(locale));

    if (available.length === 0) {
      continue;
    }

    const languages = Object.fromEntries(
      available.map((locale) => [locale, localeUrl(locale, path)])
    );
    languages['x-default'] = localeUrl(
      available.includes(DEFAULT_LOCALE) ? DEFAULT_LOCALE : available[0],
      path
    );

    for (const locale of available) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: lastModifiedOrBuildTime(post.updatedAt),
        alternates: { languages },
      });
    }
  }

  return entries;
}
