import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.TOGETHER_AI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    const { messages } = await req.json();

    const response = await openai.createChatCompletion({
        model: 'togethercomputer/llama-2-70b-chat',
        messages,
        stream: true,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}