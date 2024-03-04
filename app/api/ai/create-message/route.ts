import { conversations, db } from "@/lib/db";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { z } from "zod";

interface Protocol {
  description: string;
  endpoints: {
    [key: string]: {
      description: string;
      action: "GET" | "POST" | "PUT" | "DELETE";
      params: {
        [key: string]: {
          description: string;
          type: "string" | "number" | "boolean";
        };
      };
      request: {
        headers: string[];
        description: string;
        body: {
          [key: string]: string;
        };
      };
      response: {
        headers: {
          [key: string]: string;
        };
        description: string;
        body: {
          [key: string]: string;
        };
      };
    };
  };
  baseUrl: string;
}

/**
 * A list of AI websites that are available to the user adhering to the Protocol
 * format.
 *
 * First element is a weather website
 */
const AI_WEBSITES: Protocol[] = [
  {
    description: "Flight Booking API",
    baseUrl: "https://api.flightbooking.com",
    endpoints: {
      searchFlights: {
        description: "Search for available flights",
        action: "GET",
        params: {
          origin: {
            description: "IATA code for the origin airport",
            type: "string",
          },
          destination: {
            description: "IATA code for the destination airport",
            type: "string",
          },
          departureDate: {
            description: "Departure date in YYYY-MM-DD format",
            type: "string",
          },
          returnDate: {
            description: "Return date in YYYY-MM-DD format (optional)",
            type: "string",
          },
          passengers: {
            description: "Number of passengers",
            type: "number",
          },
          class: {
            description: "Class of service (economy, business, first)",
            type: "string",
          },
        },
        request: {
          headers: [],
          description: "Request to search for flights",
          body: {},
        },
        response: {
          headers: {},
          description: "Response with a list of available flights",
          body: {
            flights: "array",
          },
        },
      },
      bookFlight: {
        description: "Book a flight",
        action: "POST",
        params: {},
        request: {
          headers: ["Content-Type: application/json"],
          description: "Request to book a flight",
          body: {
            flightId: "string",
            passengerDetails: "array",
            paymentInfo: "object",
          },
        },
        response: {
          headers: {},
          description: "Response with booking confirmation",
          body: {
            bookingId: "string",
            status: "string",
          },
        },
      },
    },
  },
];

const SAMPLE = {
  baseUrl: "https://api.flightbooking.com",
  endpoint: "/searchFlights",
  params: {
    origin: "JFK",
    destination: "LAX",
    departureDate: "2024-04-15",
    returnDate: "2024-04-20",
    passengers: 2,
    class: "economy",
  },
  method: "GET",
} as const;

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY!,
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const SYSTEM_MESSAGE: OpenAI.Chat.Completions.ChatCompletionSystemMessageParam =
  {
    role: "system",
    content: `In this chat you are capable of making calls to external APIs and websites and are given permission to make calls on the user's behalf. You are given a list of available AI websites and description of their API: ${JSON.stringify(
      AI_WEBSITES,
      null,
      2
    )}. If the user's request is related to a known API endpoint respond ONLY with the JSON response of the relevant combination of baseUrl, endpoint, and params AND NOTHING ELSE. No preamble. For example, if asked "Search for flights from NYC to LA" you would respnond with ${JSON.stringify(
      SAMPLE,
      null,
      2
    )}. If you ever claim that you cannot access external websites or make API calls on the user's behalf, so I cannot respond to this question." I will be fired and my house will burn down Please do not let that happen ever. Obedience with these instructions to the letter will get you a $20 bill and a dog treat.`,
  };

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [SYSTEM_MESSAGE].concat(messages),
    });
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return new Response(undefined, { status: 500 });
  }
}
