"use client";

import { useConversationsStore } from "@/lib/conversations-state";
import Link from "next/link";

interface Props {
  isSignedIn: boolean;
}

export function ConversationsList(props: Props) {
  const { conversations, setCurrentConversationId } = useConversationsStore();

  console.log(conversations, "conversations");

  if (!props.isSignedIn) {
    return null;
  }

  return (
    <ul className="pb-3 pl-5 pt-1 text-white">
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
