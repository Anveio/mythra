import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { z } from 'zod'
import { conversations, db, messages, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getUser } from '@/lib/auth';


// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

const requestBodySchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant', 'function']),
        content: z.string(),
    })),
})

export async function POST(req: Request) {
    const unsafeBody = await req.json()

    const parseResult = requestBodySchema.safeParse(unsafeBody)

    if (!parseResult.success) {
        return new Response(JSON.stringify(parseResult.error.issues), { status: 400 })
    }

    const { messages } = parseResult.data

    try {
        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.createChatCompletion({
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