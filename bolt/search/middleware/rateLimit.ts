import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

export function middleware(request: NextRequest) {
    return new Promise((resolve, reject) => {
        limiter(request as any, {} as any, (result: any) => {
            if (result instanceof Error) {
                reject(result);
            } else {
                resolve(NextResponse.next());
            }
        });
    }).catch(() => {
        return new NextResponse('Too Many Requests', { status: 429 });
    });
}

export const config = {
    matcher: '/api/:path*',
};