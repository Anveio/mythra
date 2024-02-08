import { StartChatButton } from "@/components/StartChatButton";
import { Whitepaper } from "@/components/Whitepaper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

interface Props {
  params: {
    id: string;
  };
}

export default async function ConversationPage({ params }: Props) {
  return (
    <>
      <div className="radial-gradient select-none" />
      <div className={cn("relative")}>
        <div className="h-full">
          <div className="border-b-1 border-b shadow-sm">
            <div className="max-w-4xl px-2 h-14 mx-auto flex py-4 justify-between items-center">
              <Link href={"/"}>
                <h1 className="text-xl font-semibold">Mythra</h1>
              </Link>
              <div className="flex items-center">
                {" "}
                <div className="flex items-center">
                  <StartChatButton />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-2">
            <Whitepaper />
          </div>
        </div>
      </div>
    </>
  );
}
