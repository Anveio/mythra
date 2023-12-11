"use client";
import { Message, useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { WeatherWidget } from "./WeatherWidget";
import { useConversationsStore } from "@/lib/conversations-state";
import { customAlphabet } from "nanoid";

const getUrlForMessageOrNothing = (message: Message) => {
  if (message.role === "assistant") {
    const maybeJSONResponse = parseProtocol(message.content);

    if (maybeJSONResponse.success) {
      const data = maybeJSONResponse.data;
      const fullUrl = new URL(data.baseUrl + data.endpoint);
      for (const [key, value] of Object.entries(data.params)) {
        fullUrl.searchParams.append(key, value);
      }
      return {
        url: fullUrl,
        baseUrl: data.baseUrl,
        endpoint: data.endpoint,
        id: message.id,
      };
    }
  }

  return undefined;
};

const nanoid = customAlphabet("1234567890abcdef", 10);

export default function ChatBox() {
  const { conversations, currentConversationId, updateConversation } =
    useConversationsStore();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages
  } = useChat({
    initialInput: "What's the weather like in Seattle today?",
    api: "/api/ai/create-message",
    initialMessages:
      currentConversationId && conversations[currentConversationId]
        ? conversations[currentConversationId]
        : [],
  });

  console.log(currentConversationId);

  React.useEffect(() => {
    if (currentConversationId) {
      setMessages(conversations[currentConversationId] || []);
    }
  }, [currentConversationId]);

  React.useEffect(() => {
    if (currentConversationId) {
      updateConversation(currentConversationId, messages);
    }
  }, [messages]);

  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  );

  const urlHistory: Record<string, URL[]> = {};

  const consolidatedMessages: Message[] = [...messages];

  assistantMessages.forEach((message) => {
    const urlForMessage = getUrlForMessageOrNothing(message);
    if (urlForMessage) {
      urlHistory[urlForMessage.baseUrl] = urlHistory[urlForMessage.baseUrl]
        ? [...urlHistory[urlForMessage.baseUrl], urlForMessage.url]
        : [urlForMessage.url];
    }
  });

  let lastSeenBaseUrl = null;
  let lastSeenBaseUrlIndex = 0;

  /**
   * Iterate through consolidated messages forards and for any message that has
   * a base URL the same as the lastSeenBaseUrl, remove it from the array and
   * set the message of the element at the index of lastSeenBaseUrl
   */
  for (let i = 0; i < consolidatedMessages.length; i++) {
    const message = consolidatedMessages[i];
    const urlForMessage = getUrlForMessageOrNothing(message);

    if (urlForMessage) {
      if (lastSeenBaseUrl === urlForMessage.baseUrl) {
        consolidatedMessages.splice(i, 1);
        consolidatedMessages[lastSeenBaseUrlIndex] = message;
      } else {
        lastSeenBaseUrl = urlForMessage.baseUrl;
        lastSeenBaseUrlIndex = i;
      }
    }
  }

  console.log("consolidated: ", consolidatedMessages);

  return (
    <div className="flex flex-col w-full h-full">
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
              {consolidatedMessages.map((m) => {
                console.log(m);
                if (m.role === "assistant" || m.role === "system") {
                  return (
                    <AssistantMessage
                      message={m}
                      key={m.id}
                      urlHistory={urlHistory}
                    />
                  );
                } else {
                  return <UserMessage message={m} key={m.id} />;
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
        <form
          onSubmit={(e) => {
            if (isLoading) {
              return;
            }

            handleSubmit(e);
            const id = currentConversationId || nanoid();

            console.log("ID: ", id);

            updateConversation(
              id,
              messages.concat({
                content: input,
                role: "user",
                id: nanoid(),
              })
            );
          }}
        >
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

const AssistantMessage = ({
  message,
  urlHistory,
}: {
  message: Message;
  urlHistory: Record<string, URL[]>;
}) => {
  if (message.content.startsWith("{")) {
    if (message.content.endsWith("}")) {
      const maybeJSONResponse = parseProtocol(message.content);

      if (maybeJSONResponse.success) {
        const data = maybeJSONResponse.data;
        return (
          <WeatherWidget
            {...data}
            historyForUrl={urlHistory[data.baseUrl] || []}
          />
        );
      }
    } else {
      return <TypingIndicator />;
    }
  }
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
  baseUrl: z.string(),
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
    return myObjectSchema.safeParse({});
  }
};
