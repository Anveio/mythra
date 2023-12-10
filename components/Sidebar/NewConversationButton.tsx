"use client";

import { useConversationsStore } from "@/lib/conversations-state";
import { customAlphabet } from "nanoid";
import { Button } from "../ui/button";

import { PlusCircle } from "lucide-react";
const nanoid = customAlphabet("1234567890abcdef", 10);

export const NewConversationButton = () => {
  const { createConversation, setCurrentConversationId } =
    useConversationsStore();

  return (
    <div className="py-4">
      <Button
        variant={"secondary"}
        className="space-x-4 flex items-center leading-[0]"
        onClick={() => {
          const id = nanoid();
          createConversation(id);
          window.history.pushState({}, "", `?c=${id}`);
          setCurrentConversationId(id);
        }}
      >
        <PlusCircle />
        <span>New Conversation</span>
      </Button>
    </div>
  );
};
