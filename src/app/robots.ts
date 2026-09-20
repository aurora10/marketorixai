import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Generated instead of served from `public/robots.txt` so the sitemap URL is
 * always derived from SITE_URL. The static file previously advertised
 * `https://www.marketorix.com/sitemap.xml`, which 404s — that single line sent
 * Google to a dead sitemap on a host where every page 404s.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
