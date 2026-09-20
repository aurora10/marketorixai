/**
 * Single source of truth for the site's canonical origin.
 *
 * Context: the site was previously split across two hosts. `marketorix.com`
 * (apex) serves the application, while every absolute URL the app emitted
 * (canonicals, sitemap, robots.txt, JSON-LD) was hardcoded to
 * `https://www.marketorix.com` — which is not routed at the reverse proxy and
 * returns `404 page not found` for every path, including `/sitemap.xml`.
 *
 * Every absolute URL must be built from SITE_URL so the canonical host can
 * never drift between files again. To deliberately move the canonical host
 * (for example to `www`), set NEXT_PUBLIC_SITE_URL at build time instead of
 * editing code.
 */
const FALLBACK_SITE_URL = 'https://marketorix.com';

/**
 * Treats an unset *or empty* value as unconfigured. Docker build args land in
 * the environment as empty strings rather than undefined, and `'' ?? fallback`
 * would happily keep the empty string and emit relative-looking absolute URLs.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  configuredSiteUrl ? configuredSiteUrl : FALLBACK_SITE_URL
).replace(/\/+$/, '');

export const LOCALES = ['en', 'nl'] as const;

export type Locale = (typeof LOCALES)[number];

/** Locale shown to users and crawlers that express no explicit preference. */
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Absolute URL for a locale-prefixed path.
 * `localeUrl('nl', '/blog')` -> `https://marketorix.com/nl/blog`
 */
export function localeUrl(locale: string, path = ''): string {
  const suffix =
    path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;

  return `${SITE_URL}/${locale}${suffix}`;
}

/**
 * hreflang map for a locale-independent path. Every locale gets a real,
 * crawlable URL and x-default points at the default locale.
 * `languageAlternates('/services')` -> `{ en, nl, 'x-default' }`
 */
export function languageAlternates(path = ''): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, localeUrl(locale, path)])),
    'x-default': localeUrl(DEFAULT_LOCALE, path),
  };
}

/** Metadata `alternates` block (canonical + hreflang) for a locale and path. */
export function alternatesFor(locale: string, path = '') {
  return {
    canonical: localeUrl(locale, path),
    languages: languageAlternates(path),
  };
}
