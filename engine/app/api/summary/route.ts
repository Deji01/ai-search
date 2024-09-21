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

        // Fetch results from the Exa API
        const results = await fetchExaResults(query);

        // Validate that Exa results are not empty
        if (!results || !results.results || results.results.length === 0) {
            return NextResponse.json(
                { error: "No valid results from Exa API" },
                { status: 500 }
            );
        }

        // Prepare messages to send to Together API
        const messagesContent = results.results.map(
            (r) => `Title: ${r.title}\nText: ${r.text}`
        ).join('\n\n');

        const completionStream = await together.chat.completions.create({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            messages: [
                {
                    role: 'system',
                    content: `Summarize the following search results:\n\n${messagesContent}\n\nSummary:`,
                },
            ],
            stream: true,
        });

        // Collect stream chunks and decode them
        const streamChunks: string[] = [];
        const reader = completionStream.toReadableStream().getReader();
        const decoder = new TextDecoder();

        // Check if the reader is available and handle the stream properly
        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                streamChunks.push(decoder.decode(value, { stream: true }));
            }
        }

        // Join all stream chunks into a single string
        const finalOutput = streamChunks.join('');
        return NextResponse.json({ summary: finalOutput });
    } catch (error) {
        console.error('Error generating summary:', error);
        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}
