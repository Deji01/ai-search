import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AppError, handleError } from '@/lib/errorHandler';

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new AppError('Unauthorized', 401);
        }

        const { data, error } = await supabase
            .from('search_history')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false })
            .limit(20);

        if (error) throw new AppError(error.message, 500);

        return NextResponse.json({ history: data });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { query } = await request.json();

    if (!query) {
        throw new AppError('Query is required', 400);
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new AppError('Unauthorized', 401);
        }

        const { data, error } = await supabase
            .from('search_history')
            .insert({ query, user_id: user.id });

        if (error) throw new AppError(error.message, 500);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return handleError(error);
    }
}