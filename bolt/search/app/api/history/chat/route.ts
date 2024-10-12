import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AppError, handleError } from '@/lib/errorHandler';

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new AppError('Unauthorized', 401);
        }

        let query = supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });

        // Apply date filter based on the period
        const now = new Date();
        switch (period) {
            case 'today':
                query = query.gte('timestamp', now.toISOString().split('T')[0]);
                break;
            case 'yesterday':
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                query = query.gte('timestamp', yesterday.toISOString().split('T')[0])
                    .lt('timestamp', now.toISOString().split('T')[0]);
                break;
            case 'lastWeek':
                const lastWeek = new Date(now);
                lastWeek.setDate(lastWeek.getDate() - 7);
                query = query.gte('timestamp', lastWeek.toISOString());
                break;
            case 'lastMonth':
                const lastMonth = new Date(now);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                query = query.gte('timestamp', lastMonth.toISOString());
                break;
            default:
                // If no period is specified, return the last 20 entries
                query = query.limit(20);
        }

        const { data, error } = await query;

        if (error) throw new AppError(error.message, 500);

        return NextResponse.json({ history: data });
    } catch (error) {
        return handleError(error);
    }
}