import Link from "next/link";
import { Codeblock } from "./Codeblock/Codeblock";

export const Whitepaper = () => {
  return (
    <div className="max-h-[calc(100vh-56px)] h-screen">
      <div className="p-6 space-y-6">
        <h2 className="text-4xl font-semibold text-center">
          Infinite problems, infinite apps.
        </h2>
        <p className="italic text-center">
          <Link
            href="https://twitter.com/anveio"
            className="text-blue-600 dark:text-blue-500 hover:underline"
            target="_blank"
          >
            Shovon Hasan
          </Link>
          ,{" "}
          <Link
            href={"https://twitter.com/reallynaise"}
            className="text-blue-600 dark:text-blue-500 hover:underline"
            target="_blank"
          >
            Renaise Kim
          </Link>
        </p>
        <div className="my-4"></div>
        <main>
          <div className="text-lg space-y-6 break-words">
            <p className="text-center mb-2">
              <span>
                Mythra (<span className="font-bold">mith</span>
                -ruh), (noun),
              </span>{" "}
              is the concept of a latent space of available internet resources
              that LLMs can request by turning natural language queries into
              HTTP request strings.
            </p>
            <section className="space-y-3">
              <h3 className="font-semibold text-2xl">Abstract</h3>
              <p>
                This page proposes a new capability for large language models
                (LLMs) to embed live websites into chats by instructing the
                model to generate HTTP requests as text. We demonstrate that
                ChatGPT can, without pretraining, be instructed to output HTTP
                requests to websites relevant to a user's query and respond
                normally otherwise. We believe this generalizes to other
                language models.
              </p>
              <p>
                The clie browser will use the output HTTP request text to
                perform a real HTTP request and render the returned HTML, CSS,
                and JavaScript as a functional website seamlessly within the
                chat window. We call this process "summoning".
              </p>
              <p>
                We also propose a protocol for website authors to describe their
                API in a way that facilitates language models learning how to
                use the website via HTTP. To allow language models to learn
                about a website, we propose a convention where website authors
                host a /mythra.txt file at the website root which serves a text
                file adhering to the protocol.
              </p>
              <p>
                We predict that language model developers will curate a
                selection of high quality website API descriptions for trusted
                websites and that in the future most interactions humans have
                with the internet will be mediated through chats with language
                models. The language model interface will become both the
                browser and a search engine through the latent space of
                available HTTP API definitions that the language model was
                trained on. We call this latent space Mythra.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="font-semibold text-2xl">Problem</h3>
              <p>
                Websites are great specialized tools for particular problems and
                LLMs are great general tools for natural language conversations.
                But websites require learning a specialized interface for every
                new website you visit and every new problem you have, and
                language models only return text, which is very limiting as a
                problem solving tool.
              </p>
              <p>
                A few attempts have been made to bridge this gap but they've
                been lackluster. ChatGPT Plugins, such as for Wolfram Aalpha,
                requires developers to write a new application designed
                specifically for OpenAI. The application then has to be approved
                by OpenAI,and the user has to then install the plugin and then
                enable it for their chat session. The number of barriers to
                entry are so high that plugins are used by less than 1% of
                ChatGPT users. Even with plugins installed the best ChatGPT can
                do is generate an image or text as the output of the plugin,
                which doesn't create desired side effects like opening a bank
                acount, booking a flight, or filing taxes.
              </p>
              <p>
                A second iteration was Browsing for ChatGPT, but it has the same
                problem of only returning a static image or text and is not an
                interface you can continue to interact with using natural
                language in addition to other problems like not storing
                preferences or sessions the way websites would do with cookies.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="font-semibold text-2xl">Background</h3>
              <p>
                Almost all modern internet communication is done through HTTP
                requests. HTTP requests are simply strings of text (really 1s
                and 0s) that are sent over the wire and propagate through a
                global network of interconnected computers until they arrive at
                the computer meant to handle that particular HTTP request. The
                computer at the other end, upon receiving the 1s and 0s, decodes
                the binary as a string and parses the string into its
                constituent parts (the HTTP verb, the requested path, the
                headers, the form body, etc.), which it knows how to do because
                the string of text is formatted in accordance with the HTTP
                protocol, and executes some code to send back to the sender of
                the request some bit of data: HTML text, JSON text, a JPG image,
                etc. It may also choose to initiate some other side effects as a
                result of receiving this request, such as update a database.
              </p>
              <p>
                HTTP is therefore a way of using text to command computers
                across the world.
              </p>
              <p>HTTP is just text.</p>
              <p>LLMs generate text.</p>
              <p>
                What if LLMs could command computers across the world by
                generating HTTP text?
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="font-semibold text-2xl">Proposal</h3>
              <p>
                We propose a solution that solves the aforementioned problems
                and is a new way to leverage the internet: we call it
                "Summoning" a website into the user's chat. In this proposal we
                show that a website can be modified to incrementally adopt a
                simple protocol with minutes of work which will allow ChatGPT to
                understand how to use the website by translating a user's
                natural language into HTTP requests sent to the website, and
                present the website to the user in its entirety.
              </p>
              <p>
                This example application uses a non-finetuned GPT-4 via the
                OpenAI API to demonstrate that LLMs are good candidates to turn
                natural language requests into HTTP requests to fetch websites
                and display the website contents in the user's browser in-line
                with their conversation with the AI assistant.
              </p>
              <p>
                A sample weather application describes its endpoints and
                supported HTTP methods and query params in the following format:
              </p>
              <Codeblock
                className="text-base"
                filename="protocol.d.ts"
                language="typescript"
                text={`interface Protocol {
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
  baseUrl: string,
}`}
              />
              <p>
                The provided weather website describes its endpoints as follow:
              </p>
              <Codeblock
                className="text-base"
                filename="weather.ts"
                language="typescript"
                text={`const description = {
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
  baseUrl: 'https://www.example-weather-app.com'
}`}
              />
              <p>
                We believe the key to low cross-entropy loss results is for
                developers to provide as thorough and accurate a description of
                each endpoint and its parameters as possible. By ingesting these
                descriptions along with the HTTP interface, an LLM can be made
                to learn how to communicate with it purely through HTTP.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};
