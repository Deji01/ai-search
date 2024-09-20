"use server"

import Together from 'together-ai'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

const together = new Together({
  apiKey: TOGETHER_API_KEY
});

export async function generateAIResponse(userMessage: string) {
  try {
    console.log("Generating AI response for:", userMessage)
    const completion = await together.chat.completions.create({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: 'You are an AI assistant' },
        { role: 'user', content: userMessage },
      ],
      stream: false,
    })

    const response = completion.choices[0]?.message?.content || ''
    console.log("AI response:", response)
    return response
  } catch (error) {
    console.error("Error generating AI response:", error)
    throw new Error("Failed to generate AI response")
  }
}