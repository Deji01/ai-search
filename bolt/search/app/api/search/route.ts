import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://api.exa.ai/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        return NextResponse.json({ results: data.results });
    } catch (error) {
        console.error('Error fetching search results:', error);
        return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
    }
}