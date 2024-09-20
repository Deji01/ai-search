// app/api/together/route.ts
import { NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { userMessage } = await req.json();
        console.log('Generating AI response for:', userMessage);

        const completion = await together.chat.completions.create({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            messages: [
                { role: 'system', content: 'You are an AI assistant' },
                { role: 'user', content: userMessage },
            ],
            stream: false,
        });

        const response = completion.choices[0]?.message?.content || '';
        console.log('AI response:', response);
        return NextResponse.json({ response });
    } catch (error) {
        console.error('Error generating AI response:', error);
        return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
    }
}
