// app/api/summary/route.ts
import { NextResponse } from 'next/server';
import Together from 'together-ai';
import { fetchExaResults } from '@/actions/exa-actions'; // Update this import path if necessary

const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        // Validate the query input
        if (!query || query.trim() === "") {
            return NextResponse.json(
                { error: "Query cannot be empty" },
                { status: 400 }
            );
        }

        const results = await fetchExaResults(query); // Function that calls Exa API to get results

        const completionStream = await together.chat.completions.create({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            messages: [
                {
                    role: 'system',
                    content: `Summarize the following search results:\n\n${results.results.map(
                        r => `Title: ${r.title}\nText: ${r.text}`
                    ).join('\n\n')}\n\nSummary:`,
                },
            ],
            stream: true,
        });

        const streamChunks: string[] = [];
        const reader = completionStream.toReadableStream().getReader();
        const decoder = new TextDecoder();

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                streamChunks.push(decoder.decode(value));
            }
        }

        const finalOutput = streamChunks.join('');
        return NextResponse.json({ summary: finalOutput });
    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}
