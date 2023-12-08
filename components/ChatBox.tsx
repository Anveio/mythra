"use client";

import * as React from "react";
import { useChat } from "ai/react";
import { Button, TextField } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialInput: "Say Yes or No randomly",
      api: "/api/ai/create-message",
    });

  return (
    <div className="flex flex-col">
      <div className="relative flex-1">
        <div className="flex flex-col items-center justify-center">
          {messages.length === 0 && !isLoading ? (
            <div className="mb-5 text-2xl font-medium text-center">
              How can I help you today?
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {m.role}: {m.content}
                </motion.div>
              ))}
              {isLoading && messages.at(-1)?.role === "user" && (
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  ...
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      <div className="p">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-3">
            <Input
              placeholder="Say something..."
              value={input}
              onChange={handleInputChange}
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
