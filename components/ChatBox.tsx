"use client";

import * as React from "react";
import { useChat } from "ai/react";
import { TextField } from "@radix-ui/themes";

export default function ChatBox() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/ai/create-message",
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <TextField.Root>
          <TextField.Input
            placeholder="Search the docs…"
            value={input}
            onChange={handleInputChange}
          />
        </TextField.Root>
      </form>
    </div>
  );
}
