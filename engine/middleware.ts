import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const forwardedHost = req.headers.get('x-forwarded-host');
    const origin = req.headers.get('origin');

    // Skip host check in development or non-production environments
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
        return NextResponse.next();
    }

    // Log the forwardedHost and origin for debugging
    console.log('Forwarded host:', forwardedHost);
    console.log('Origin:', origin);

    if (forwardedHost && origin && forwardedHost !== new URL(origin).host) {
        console.warn('Forwarded host and origin do not match:', forwardedHost, origin);
        return NextResponse.redirect(new URL('/', req.url)); // Or handle with an error response
    }

    return NextResponse.next();
}

