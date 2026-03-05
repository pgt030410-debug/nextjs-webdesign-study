import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'ko'],
    // Used when no locale matches
    defaultLocale: 'ko',
    // Do not prefix the default locale
    localePrefix: 'as-needed'
});

const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle logout route to safely clear cookies when Server Components detect 401 Unauthorized
    if (pathname === '/logout' || pathname.endsWith('/logout')) {
        const localeMatch = pathname.match(/^\/(en|ko)\//);
        const prefix = localeMatch ? `/${localeMatch[1]}` : '';
        const response = NextResponse.redirect(new URL(`${prefix}/login`, request.url));
        response.cookies.delete('auth_token');
        return response;
    }

    const token = request.cookies.get('auth_token')?.value;

    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route) || pathname.startsWith(`/en${route}`) || pathname.startsWith(`/ko${route}`));

    // Ignore static files and api routes
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Auth checks before i18n routing
    // Redirect to login if accessing private route without token
    if (!token && !isPublicRoute) {
        // preserve the locale prefix if it exists
        const localeMatch = pathname.match(/^\/(en|ko)\//);
        const prefix = localeMatch ? `/${localeMatch[1]}` : '';
        return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
    }

    // Redirect to dashboard if accessing public route with token
    if (token && isPublicRoute) {
        // preserve the locale prefix if it exists
        const localeMatch = pathname.match(/^\/(en|ko)\//);
        const prefix = localeMatch ? `/${localeMatch[1]}` : '';
        return NextResponse.redirect(new URL(`${prefix}/`, request.url));
    }

    // Proceed to next-intl middleware for locale negotiation
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames, excluding _next, api, and files
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
