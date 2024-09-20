// app/api/exa/route.ts
import { NextResponse } from 'next/server';
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        console.log(`Searching for: ${query}`);

        const result = await exa.searchAndContents(query, {
            type: 'neural',
            useAutoprompt: true,
            numResults: 10,
            text: true,
        });

        console.log('Search results:', JSON.stringify(result, null, 2));
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error performing search:', error);
        return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
    }
}
