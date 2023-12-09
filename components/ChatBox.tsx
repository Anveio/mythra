"use client";
import { useLocalStorage } from "@uidotdev/usehooks";

import { Message, useChat } from "ai/react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialInput: "Say Yes or No randomly",
      api: "/api/ai/create-message",
    });

  console.log(messages);

  return (
    <div className="flex flex-col">
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
                  return (
                    <>
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="col-span-4 flex justify-start"
                      >
                        <span className="p-4 rounded-md  bg-gray-200 dark:bg-gray-800 text-left">
                          {m.content}
                        </span>
                      </motion.div>
                      <div className="col-span-2"></div>
                    </>
                  );
                }

                return (
                  <>
                    <div className="col-span-2"></div>
                    <motion.div
                      key={m.id}
                      className="col-span-4 flex justify-end"
                    >
                      <span className="p-4 rounded-md bg-gray-200 dark:bg-gray-800 text-right">
                        {m.content}
                      </span>
                    </motion.div>
                  </>
                );
              })}

              {isLoading && messages.at(-1)?.role === "user" && (
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
