import { ConversationListColumn } from "@/components/email-list-column";
import * as React from "react";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ConversationListColumn searchParams={{}} />
      {children}
    </>
  );
}
