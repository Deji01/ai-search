"use server"

import { SearchResult } from "@/types/search"
import Together from 'together-ai'

const EXA_API_KEY = process.env.EXA_API_KEY
const EXA_API_URL = "https://api.exa.ai/search"
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

const together = new Together({
    apiKey: TOGETHER_API_KEY
});

// Fetch results from EXA API
export async function fetchExaResults(query: string): Promise<SearchResult[]> {
    if (!EXA_API_KEY) {
        throw new Error("EXA_API_KEY is not set")
    }

    const response = await fetch(EXA_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${EXA_API_KEY}`
        },
        body: JSON.stringify({ query })
    })

    if (!response.ok) {
        throw new Error(`Exa API request failed with status ${response.status}`)
    }

    const data = await response.json()

    return data.results.slice(0, 5).map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        published_date: result.published_date,
        author: result.author
    }))
}

// Generate a streaming summary of the search results

export async function generateStreamingSummary(results: SearchResult[]) {
    const completionStream = await together.chat.completions.create({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
            {
                role: 'system',
                content: `Summarize the following search results:\n\n${results.map(
                    r => `Title: ${r.title}\nSnippet: ${r.snippet}`
                ).join("\n\n")}\n\nSummary:`
            }
        ],
        stream: true
    });

    const streamChunks: string[] = [];

    // Iterate over the stream of chat completion chunks
    for await (const chunk of completionStream) {
        // Extract the content from the chunk (if available)
        for (const choice of chunk.choices) {
            const content = choice.delta?.content;
            if (content) {
                streamChunks.push(content);
            }
        }
    }

    // Combine all the content chunks into a single response
    const finalOutput = streamChunks.join('');
    return new Response(finalOutput, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}
