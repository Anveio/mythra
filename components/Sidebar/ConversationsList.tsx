"use client";

import { useConversationsStore } from "@/lib/conversations-state";
import Link from "next/link";
import React from "react";

export default function ConversationsList() {
  const { conversations, setCurrentConversationId } = useConversationsStore();

  return (
    <ul className="pb-3 pt-1 text-white">
      {Object.entries(conversations).map(([id, messages]) => (
        <li key={id}>
          <Link
            className="overflow-hidden whitespace-normal text-sm shadow-md"
            onClick={() => {
              setCurrentConversationId(id);
            }}
            href={`/?c=${id}`}
          >
            <span className="truncate-non">
              {messages && messages[0]
                ? truncate(messages[0].content, 24)
                : "Empty Conversation"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * Function to truncate a string with ellipses at the end if it's longer than 24 characters
 */
function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + "..." : str;
}
