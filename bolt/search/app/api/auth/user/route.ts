import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            return NextResponse.json({ user }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}