import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'nl'],

    // Used when no locale matches
    defaultLocale: 'en'
});

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
