import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function GET(request: Request) {
    try {
        const { data, error } = await supabase
            .from('search_history')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(20);

        if (error) throw error;

        return NextResponse.json({ history: data });
    } catch (error) {
        console.error('Error fetching search history:', error);
        return NextResponse.json({ error: 'Failed to fetch search history' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { query } = await request.json();

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('search_history')
            .insert({ query, timestamp: new Date().toISOString() });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error saving search history:', error);
        return NextResponse.json({ error: 'Failed to save search history' }, { status: 500 });
    }
}