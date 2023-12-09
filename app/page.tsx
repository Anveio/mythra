import ChatBox from "@/components/ChatBox";
import { EmailEmptyView } from "@/components/email-empty-view";
import * as React from "react";

interface Props {
  params: {
    id: string;
  };
}

export default async function ConversationPage({ params }: Props) {
  return (
    <React.Suspense fallback={<EmailEmptyView />}>
      <ChatBox />
    </React.Suspense>
  );
}
