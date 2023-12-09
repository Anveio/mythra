"use client";
import { useLocalStorage } from "@uidotdev/usehooks";

import { Message, useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { WeatherWidget } from "./WeatherWidget";

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialInput: "What's the weather like in Seattle today?",
      api: "/api/ai/create-message",
      initialMessages: [
        {
          content: "What's the weather like in Seattle today?",
          role: "user",
          createdAt: new Date("2023-12-09T22:27:53.467Z"),
          id: "MYykhXT",
        },
        {
          id: "0pL1UNu",
          createdAt: new Date("2023-12-09T22:28:53.467Z"),
          content:
            '{"baseUrl":"ai://nightsky","endpoint":"/weather","params":{"city":"Seattle"}}',
          role: "assistant",
        },
      ],
    });

  console.log(messages);

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex-1">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col h-full items-center justify-center">
            <div className="mb-5 text-2xl font-medium text-center">
              How can I help you today?
            </div>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-6 gap-3">
            <AnimatePresence>
              {messages.map((m) => {
                if (m.role === "assistant" || m.role === "system") {
                  return <AssistantMessage message={m} />;
                } else {
                  return <UserMessage message={m} />;
                }
              })}

              {isLoading && messages.at(-1)?.role === "user" && (
                <TypingIndicator />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="p-4 sticky bottom-2">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-3">
            <Input
              placeholder="Say something..."
              value={input}
              className="shadow-lg"
              onChange={handleInputChange}
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const AssistantMessage = ({ message }: { message: Message }) => {
  if (message.role === "system") {
    return null;
  }

  if (message.content.startsWith("{")) {
    if (message.content.endsWith("}")) {
      const maybeJSONResponse = parseProtocol(message.content);

      if (maybeJSONResponse.success) {
        const data = maybeJSONResponse.data;
        return <WeatherWidget {...data}/>;
      }
    } else {
      return <TypingIndicator />;
    }
  }

  return (
    <React.Fragment key={message.id}>
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="col-span-4 flex justify-start"
      >
        <AnimatePresence>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-left"
          >
            {message.content}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <div className="col-span-2"></div>
    </React.Fragment>
  );
};

const UserMessage = ({ message }: { message: Message }) => {
  return (
    <React.Fragment key={message.id}>
      <div className="col-span-2"></div>
      <motion.div className="col-span-4 flex justify-end">
        <span className="p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-right">
          {message.content}
        </span>
      </motion.div>
    </React.Fragment>
  );
};

const TypingIndicator = () => {
  return (
    <>
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="col-span-4 flex justify-start"
      >
        <span className="p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-left">
          ...
        </span>
      </motion.div>
      <div className="col-span-2"></div>
    </>
  );
};

const myObjectSchema = z.object({
  baseUrl: z.string().regex(/^ai:\/\/.+/),
  endpoint: z.string(),
  params: z.object({
    city: z.string().optional(),
  }),
});

const parseProtocol = (message: string) => {
  try {
    const invalidatedJson = JSON.parse(message);
    return myObjectSchema.safeParse(invalidatedJson);
  } catch (e) {
    throw myObjectSchema.safeParse({});
  }
};
