import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, LOCALES, isLocale } from '@/lib/site';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: [...LOCALES],

    // Used when no locale matches
    defaultLocale: DEFAULT_LOCALE
});

/**
 * The root path is handled explicitly so it issues a *permanent* redirect.
 *
 * next-intl's own locale detection replies 307, which tells Google the move is
 * temporary: it keeps `/` as the canonical and refuses to consolidate signals
 * onto `/en` (or `/nl`). A 301 on the root is stable and cacheable.
 *
 * The destination is derived from the NEXT_LOCALE cookie only — deliberately
 * not from Accept-Language, because a crawler-varying redirect destination is
 * exactly what makes Google treat a root URL as unstable. Clients with no
 * cookie (including every crawler) are sent to the default locale.
 */
export default function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === '/') {
        const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
        const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;

        const url = request.nextUrl.clone();
        url.pathname = `/${locale}`;

        const response = NextResponse.redirect(url, 301);
        // The destination depends on a cookie, so shared caches must not reuse it.
        response.headers.set('Vary', 'Cookie');
        return response;
    }

    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Match all pathnames except for
        // - … if they contain a dot, e.g. `favicon.ico`
        // - /api
        // - /_next
        // - /_vercel
        '/((?!api|_next|_vercel|.*\\..*).*)',
        // However, we want to match the root and locales explicitly
        '/',
        '/(en|nl)/:path*'
    ]
};
