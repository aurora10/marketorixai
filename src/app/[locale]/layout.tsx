// src/app/[locale]/layout.tsx

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import "../globals.css";
import { CSPostHogProvider } from '../providers';
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SITE_URL, alternatesFor, isLocale } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-inter'
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/**
 * Default metadata for the locale segment. Because `page.tsx` for the home
 * route is a client component it cannot export metadata itself, so the
 * `alternates` here describe the home page: `/en` or `/nl`.
 *
 * Next.js replaces (does not deep-merge) a top-level metadata field, so every
 * child route — services, team, contact, blog, blog/[slug] — sets its own
 * `alternates` and will not inherit this canonical. If you add a new route,
 * give it its own canonicals.
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(locale)) notFound();

  return {
    metadataBase: new URL(SITE_URL),
    title: "Marketorix | AI Solutions for Business",
    description: "Marketorix builds, fixes, and manages AI tools for businesses. Smart automation, customer support bots, data integration, and AI strategy — with clear pricing and real results.",
    alternates: alternatesFor(locale),
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  /**
   * Reject any first segment that is not a real locale.
   *
   * The middleware matcher deliberately skips paths containing a dot (so
   * `/favicon.ico`, `/robots.txt`, image files and `_next` assets are never
   * locale-prefixed), which means a dotted path never reaches locale handling.
   * Without this guard such a path falls through to `[locale]` with the entire
   * junk segment as the "locale" — `/foo.png` rendered the home page as
   * `HTTP 200` with `<html lang="foo.png">` and
   * `<link rel="canonical" href="https://marketorix.com/foo.png">`, i.e. an
   * unbounded set of self-canonical duplicates of the home page. Dotted paths
   * are also the only ones affected: every non-dotted unknown path is already
   * locale-normalized by the middleware and 404s (`/pricing` -> `/en/pricing`).
   *
   * The check lives in the layout, not in the home page, because `[locale]` is
   * the parent segment of every route: `/foo.png/blog` reached the blog route
   * the same way. Real static files are unaffected — Next serves `public/`
   * before routing, and `robots.txt`/`sitemap.xml` are real app routes.
   */
  if (!isLocale(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Marketorix",
              "url": SITE_URL,
              "logo": `${SITE_URL}/logo.svg`,
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+32465811031",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>

      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CSPostHogProvider>
            {children}
          </CSPostHogProvider>

          <CookieConsentBanner />
          <AnalyticsWrapper gaId={process.env.NEXT_PUBLIC_GA_ID} />
        </NextIntlClientProvider>
      </body>

    </html>
  );
}