import ChatBox from "@/components/ChatBox";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";

interface Props {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: Props) {
  return (
    <>
      <div className="radial-gradient select-none" />
      <div
        className={cn(
          "relative",
          "md:grid md:grid-cols-[15rem_1fr] h-screen min-h-screen max-h-screen overflow-y-hidden"
        )}
      >
        <Sidebar />
        <div className="h-full max-h-screen overflow-y-hidden">
          <div className="border-b-1 border-b shadow-sm">
            <div className="max-w-4xl h-14 mx-auto flex py-4 justify-between items-center">
              <Link href={"/"}>
                <h1 className="text-xl font-semibold">Mythra</h1>
              </Link>
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-2 h-full">
            <ChatBox />
          </div>
        </div>
      </div>
    </>
  );
}
