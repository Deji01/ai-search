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

        // Validate that Exa results are not empty or undefined
        if (!results || results.length === 0) {
            console.error('Exa API returned no valid results');
            return NextResponse.json(
                { error: "No valid results from Exa API" },
                { status: 500 }
            );
        }

        // Sort results by score and handle potential undefined values
        const sortedResults = results
            .filter((r) => r.title && r.text) // Filter out results without title or text
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 5); // Select top 5 results

        // Ensure there are valid results after sorting
        if (sortedResults.length === 0) {
            console.error('No valid search results to summarize');
            return NextResponse.json(
                { error: "No valid search results to summarize" },
                { status: 500 }
            );
        }

        // Prepare messages to send to Together API
        const messagesContent = sortedResults
            .map((r) => `Title: ${r.title}\nText: ${r.text}`)
            .join('\n\n');

        // Check if messagesContent is empty
        if (!messagesContent || messagesContent.trim() === "") {
            console.error('Messages content is empty');
            return NextResponse.json(
                { error: "Messages content cannot be empty" },
                { status: 500 }
            );
        }

        // Send the request to Together API
        const completionStream = await together.chat.completions.create({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            messages: [
                {
                    role: 'system',
                    content: `Summarize the following top 5 search results:\n\n${messagesContent}\n\nSummary:`,
                },
            ],
            stream: true,
        });

        // Collect stream chunks and decode them
        const streamChunks: string[] = [];
        const reader = completionStream.toReadableStream().getReader();
        const decoder = new TextDecoder();

        // Handle stream properly
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
