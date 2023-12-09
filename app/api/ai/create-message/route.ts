import { conversations, db } from '@/lib/db';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { z } from 'zod';


const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY!,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages,
        })
        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response)
        // Respond with the stream
        return new StreamingTextResponse(stream)
    } catch (e) {
        console.error(e)
        return new Response(undefined, { status: 500 })
    }
}


const createMessageSchema = z.object({
    conversationId: z.string().length(6),
    messageId: z.string().length(6),
    userId: z.string(),
    content: z.string(),
})

const createConversationSchema = z.object({
    conversationId: z.string().length(6),
    userId: z.string(),
})


const createConversation = (conversationId: string, userId: string) => {
    const parseResult = createConversationSchema.parse({
        conversationId,
        userId,
    })

    return db.transaction(async (tx) => {
        return await tx.insert(conversations).values({
            id: parseResult.conversationId,
            userId: userId,
        }).execute()
    })
}