# Step-by-Step Guide: Implementing Dutch Internationalization (for MarketorixAI)

## Objective
To create a fully localized Dutch (`nl`) version of the website alongside the existing English (`en`) version. This guide is specifically tailored for the MarketorixAI project and is intended for a junior developer. Each step provides exact file names and code snippets to copy.

We will use the `next-intl` library, which is designed for the Next.js App Router.

---

### Step 1: Initial Setup

1.  **Install `next-intl`:**
    Open your terminal and run this command:
    ```bash
    npm install next-intl
    ```

2.  **Create i18n Configuration File:**
    Create a new file named `i18n.ts` inside the `src` folder.
    
    **File:** `src/i18n.ts`
    ```typescript
    import {getRequestConfig} from 'next-intl/server';
    
    export default getRequestConfig(async ({locale}) => ({
      messages: (await import(`../locales/${locale}.json`)).default
    }));
    ```

3.  **Create Translation Files:**
    Create a new folder named `locales` in the project root. Inside this folder, create two files: `en.json` and `nl.json`.

    **File:** `locales/en.json`
    ```json
    {
      "Navigation": {
        "services": "Services",
        "blog": "Blog",
        "team": "Team",
        "contact": "Contact Us"
      },
      "ServicesPage": {
        "title": "Our Services",
        "description": "Discover what we can do for you."
      },
      "ContactPage": {
        "title": "Get in Touch",
        "description": "Contact us for more information."
      }
    }
    ```

    **File:** `locales/nl.json`
    ```json
    {
      "Navigation": {
        "services": "Diensten",
        "blog": "Blog",
        "team": "Team",
        "contact": "Neem contact op"
      },
      "ServicesPage": {
        "title": "Onze Diensten",
        "description": "Ontdek wat wij voor u kunnen betekenen."
      },
      "ContactPage": {
        "title": "Neem contact op",
        "description": "Neem contact met ons op voor meer informatie."
      }
    }
    ```

4.  **Create and Configure Middleware:**
    Create a new file named `middleware.ts` in the project root. This file will manage the URL routing for different languages.

    **File:** `middleware.ts`
    ```typescript
    import createMiddleware from 'next-intl/middleware';

    export default createMiddleware({
      locales: ['en', 'nl'],
      defaultLocale: 'en'
    });

    export const config = {
      matcher: ['/((?!api|_next|_vercel|.*\..*).*)']
    };
    ```

---

### Step 2: Restructure the `app` Directory

We need to move all pages into a new `[locale]` folder so Next.js can handle the language in the URL.

1.  **Create the new directory:**
    ```bash
    mkdir src/app/[locale]
    ```

2.  **Move the existing pages:**
    Run these commands in your terminal one by one.
    ```bash
    mv src/app/layout.tsx src/app/[locale]/
    mv src/app/page.tsx src/app/[locale]/
    mv src/app/services/ src/app/[locale]/
    mv src/app/contact/ src/app/[locale]/
    mv src/app/team/ src/app/[locale]/
    mv src/app/blog/ src/app/[locale]/
    ```
    *(Note: The `sitemap.ts`, `globals.css`, `favicon.ico` and `api` folder should remain in `src/app/`)*

---

### Step 3: Update Layout and Pages

1.  **Update the Main Layout:**
    Modify the `layout.tsx` file you just moved. This change adds a provider that gives all pages access to the translation files.

    **File:** `src/app/[locale]/layout.tsx`
    ```typescript
    import {NextIntlClientProvider, useMessages} from 'next-intl';
    import { GeistSans } from 'geist/font/sans'; // Assuming you use Geist font
    import '../globals.css';
    import Header from '@/components/Header'; // Make sure Header is imported

    export default function RootLayout({
      children,
      params: {locale}
    }: {
      children: React.ReactNode;
      params: {locale: string};
    }) {
      const messages = useMessages();

      return (
        <html lang={locale} className={GeistSans.className}>
          <body>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
              {children}
              {/* If you have a Footer component, it would go here */}
            </NextIntlClientProvider>
          </body>
        </html>
      );
    }
    ```

2.  **Translate the Services Page:**
    As an example, let's translate the title on the services page.

    **File:** `src/app/[locale]/services/page.tsx`
    ```typescript
    import {useTranslations} from 'next-intl';

    export default function ServicesPage() {
      const t = useTranslations('ServicesPage');

      return (
        <main>
          {/* Replace existing title with this */}
          <h1>{t('title')}</h1>
          <p>{t('description')}</p>
          
          {/* The rest of your page content */}
        </main>
      );
    }
    ```
    *You will do the same for `contact/page.tsx`, `team/page.tsx`, etc., for any static text.*

---

### Step 4: Create and Integrate the Language Switcher

1.  **Create the LanguageSwitcher Component:**
    This component will show "EN | NL" and allow users to switch languages.

    **File:** `src/components/LanguageSwitcher.tsx`
    ```tsx
    'use client';

    import { usePathname, useRouter } from 'next/navigation';
    import { useLocale } from 'next-intl';
    import { useState, useTransition } from 'react';

    export default function LanguageSwitcher() {
      const router = useRouter();
      const [isPending, startTransition] = useTransition();
      const pathname = usePathname();
      const locale = useLocale();

      const handleSwitch = (nextLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, '');
        startTransition(() => {
          router.replace(`/${nextLocale}${newPath}`);
        });
      };

      return (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => handleSwitch('en')} 
            disabled={locale === 'en' || isPending}
            style={{ fontWeight: locale === 'en' ? 'bold' : 'normal', cursor: 'pointer' }}
          >
            EN
          </button>
          <span>|</span>
          <button 
            onClick={() => handleSwitch('nl')} 
            disabled={locale === 'nl' || isPending}
            style={{ fontWeight: locale === 'nl' ? 'bold' : 'normal', cursor: 'pointer' }}
          >
            NL
          </button>
        </div>
      );
    }
    ```

2.  **Add Switcher to Header:**
    Open the `Header.js` file and add the new `LanguageSwitcher` component.

    **File:** `src/components/Header.js`
    ```javascript
    import { useTranslations } from 'next-intl';
    import Link from 'next/link';
    import LanguageSwitcher from './LanguageSwitcher'; // <-- 1. IMPORT THE COMPONENT

    export default function Header() {
      const t = useTranslations('Navigation');

      return (
        <header>
          <nav>
            {/* Your Logo */}
            <Link href="/">{/* Your Logo SVG/Image */}</Link>

            {/* Navigation Links */}
            <ul>
              <li><Link href="/services">{t('services')}</Link></li>
              <li><Link href="/blog">{t('blog')}</Link></li>
              <li><Link href="/team">{t('team')}</Link></li>
              <li><Link href="/contact">{t('contact')}</Link></li>
            </ul>

            {/* 2. ADD THE SWITCHER HERE */}
            <LanguageSwitcher />
          </nav>
        </header>
      );
    }
    ```
    *Note: You will need to convert `Header.js` to a client component by adding `'use client';` to the top of the file.*

---

### Step 5: Update Strapi Integration

1.  **Enable Localization in Strapi:**
    - In your Strapi Admin, go to `Settings` -> `Internationalization`.
    - Add "Dutch (nl)" as a locale.
    - For the "Blog Post" Content-Type, go to its settings and enable localization.

2.  **Update API Fetching in `api.ts`:**
    Modify your functions in `src/lib/api.ts` to accept a `locale` and pass it to Strapi.

    **File:** `src/lib/api.ts`
    ```typescript
    // Find your function that gets blog posts, it might be named differently.
    // Add the 'locale: string' parameter to it.
    export async function getPosts(locale: string) { 
      // Add the `_locale` query parameter to the fetch URL.
      const res = await fetch(`https://your-strapi-url/api/posts?populate=*&_locale=${locale}`);
      // ... rest of the function
    }

    // Do the same for the function that gets a single post by slug.
    export async function getPostBySlug(slug: string, locale: string) {
      const res = await fetch(`https://your-strapi-url/api/posts?filters[slug][$eq]=${slug}&_locale=${locale}`);
      // ... rest of the function
    }
    ```

3.  **Update Blog Pages to Pass Locale:**
    
    **File:** `src/app/[locale]/blog/page.tsx`
    ```typescript
    import { getPosts } from '@/lib/api';

    // The locale is automatically passed in the params
    export default async function BlogIndex({ params: { locale } }: { params: { locale: string } }) {
      // Pass the locale to your API function
      const posts = await getPosts(locale); 
      
      return (
        // ... your page rendering logic
      );
    }
    ```

    **File:** `src/app/[locale]/blog/[slug]/page.tsx`
    ```typescript
    import { getPostBySlug } from '@/lib/api';

    export default async function BlogPost({ params }: { params: { slug: string, locale: string } }) {
      // Pass both slug and locale to your API function
      const post = await getPostBySlug(params.slug, params.locale);
      
      return (
        // ... your page rendering logic
      );
    }
    ```

---

### Step 6: Update Sitemaps for SEO

The existing `sitemap.ts` needs to be replaced with a system that generates sitemaps for both languages.

1.  **Delete the old sitemap file:**
    ```bash
    rm src/app/sitemap.ts
    ```

2.  **Create a Sitemap Index:**
    This file will tell search engines that you have two sitemaps.

    **File:** `src/app/sitemap.xml/route.ts`
    ```typescript
    import { NextResponse } from 'next/server';

    export async function GET() {
      const sitemapIndex = `
        <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          <sitemap>
            <loc>https://www.marketorixai.com/en/sitemap.xml</loc>
          </sitemap>
          <sitemap>
            <loc>https://www.marketorixai.com/nl/sitemap.xml</loc>
          </sitemap>
        </sitemapindex>
      `;
      return new NextResponse(sitemapIndex, {
        headers: { 'Content-Type': 'application/xml' }
      });
    }
    ```

3.  **Create Locale-Specific Sitemaps:**
    Create two new files, one for the English sitemap and one for the Dutch.

    **File:** `src/app/en/sitemap.xml/route.ts`
    ```typescript
    import { getPosts } from '@/lib/api';
    import { NextResponse } from 'next/server';

    export async function GET() {
      const posts = await getPosts('en'); // Fetch English posts
      const staticUrls = [
        { url: 'https://www.marketorixai.com/en', priority: 1 },
        { url: 'https://www.marketorixai.com/en/services', priority: 0.8 },
        { url: 'https://www.marketorixai.com/en/contact', priority: 0.5 },
      ];
      
      const postUrls = posts.map(post => ({
        url: `https://www.marketorixai.com/en/blog/${post.slug}`,
        priority: 0.7,
        lastModified: new Date(post.updatedAt).toISOString(),
      }));

      const urls = [...staticUrls, ...postUrls];

      const sitemap = `...`; // XML generation logic here
      return new NextResponse(sitemap, { headers: { 'Content-Type': 'application/xml' } });
    }
    ```
    *You will need to create a similar file `src/app/nl/sitemap.xml/route.ts`, but call `getPosts('nl')` and use `/nl` in all URLs.*

This detailed guide should provide a clear path for the developer to follow.
