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

/**
 * Alternates for a page that exists in a known subset of locales.
 *
 * `alternatesFor` assumes every locale has an equivalent page, which is wrong
 * for content whose translations do not exist yet: an `nl` hreflang that Google
 * finds in the sitemap *and* on the English page is a claim that a Dutch
 * article is published, and this site's CMS currently cannot deliver one.
 *
 * Canonical stays on the requested locale, so a fallback URL keeps working for
 * visitors, but the hreflang set is only emitted when at least two locales are
 * genuinely published — a set of one has nothing to annotate and a
 * self-referential hreflang is noise.
 */
export function alternatesForLocales(
  locale: string,
  path: string,
  published: readonly string[]
) {
  const canonical = localeUrl(locale, path);
  const locales = LOCALES.filter((candidate) => published.includes(candidate));

  if (locales.length < 2) return { canonical };

  const languages: Record<string, string> = Object.fromEntries(
    locales.map((candidate) => [candidate, localeUrl(candidate, path)])
  );

  if (locales.includes(DEFAULT_LOCALE)) {
    languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);
  }

  return { canonical, languages };
}

/**
 * Alternates for content that exists in one locale only.
 *
 * Use this instead of `alternatesFor` whenever the other locale has no
 * equivalent page: emitting an `nl` hreflang for English-only content points
 * Google at a 404, which is worse than declaring no alternate at all.
 */
export function singleLocaleAlternates(locale: string, path = '') {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      [locale]: localeUrl(locale, path),
      'x-default': localeUrl(locale, path),
    },
  };
}
