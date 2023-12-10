import { conversations, db } from '@/lib/db';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import { z } from 'zod';

interface Protocol {
    description: string,
    endpoints: {
        [key: string]: {
            description: string,
            action: 'GET' | 'POST' | 'PUT' | 'DELETE',
            params: {
                [key: string]: {
                    description: string,
                    type: 'string' | 'number' | 'boolean'
                }
            },
            request: {
                headers: string[],
                description: string
                body: {
                    [key: string]: string
                }
            },
            response: {
                headers: {
                    [key: string]: string
                },
                description: string;
                body: {
                    [key: string]: string
                }
            }
        }
    },
    baseUrl: `${string}`,
}

/**
 * A list of AI websites that are available to the user adhering to the Protocol
 * format.
 * 
 * First element is a weather website
 */
const AI_WEBSITES: Protocol[] = [
    {
        description: 'A weather website',
        endpoints: {
            '/weather': {
                description: 'Get the weather for a given city',
                action: 'GET',
                params: {
                    city: {
                        description: '',
                        type: 'string'
                    },
                },
                request: {
                    headers: ['Token', "unit"],
                    description: 'An authentication token to attach to the request',
                    body: {}
                },
                response: {
                    headers: {},
                    description: 'The weather for the given location',
                    body: {
                        temperature: 'number',
                        unit: "F or C",
                        rainPercentage: 'number',
                        windSpeed: 'number',
                        location: 'string'
                    }
                }
            },
            /**
             * And endpoint for getting the 5-day forecast
             */
            '/forecast': {
                description: 'Get the 5-day forecast for a given location',
                action: 'GET',
                params: {
                    location: {
                        description: 'The location to get the 5-day forecast for',
                        type: 'string'
                    },
                    startDate: {
                        description: 'The start date of the forecast',
                        type: 'string'
                    }
                },
                request: {
                    headers: ['Token'],
                    description: 'An authentication token to attach to the request',
                    body: {}
                },
                response: {
                    headers: {},
                    description: 'The forecast for the given location',
                    body: {
                        temperature: 'number',
                        weather: 'string',
                        location: 'string'
                    }
                }
            }
        },
        baseUrl: 'http://www.example-weather-app.com'
    }
]

const SAMPLE = { "baseUrl": "http://www.example-weather-app.com", "endpoint": "/weather", "params": { "location": "Seattle" } }

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY!,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

const SYSTEM_MESSAGE: OpenAI.Chat.Completions.ChatCompletionSystemMessageParam = {
    role: 'system',
    content: `You are given a list of available AI websites  and description of their API: ${JSON.stringify(AI_WEBSITES)}. When asked to respond, prefer to respond ONLY with the most relevant combination of baseUrl, endpoint, and params AND NOTHING ELSE. For example, if asked "What's the weather in seattle" you would respnond with ${JSON.stringify(SAMPLE)} If none are avilable, respond normally. Do not ever explain to the user your limitations around the API descriptions`
}

export async function POST(req: Request) {
    const { messages } = await req.json();

    try {
        // Ask OpenAI for a streaming chat completion given the prompt
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            stream: true,
            messages: [SYSTEM_MESSAGE].concat(messages),
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