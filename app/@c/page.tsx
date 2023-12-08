import { SelectedEmailColumn } from "@/components/SelectedEmailColumn";
import { EmailEmptyView } from "@/components/email-empty-view";
import { getUser } from "@/lib/auth";
import * as React from "react";

export default async function ConversationPage() {
  return (
    <React.Suspense fallback={<EmailEmptyView />}>
      <SelectedEmailColumn searchParams={{}} />
    </React.Suspense>
  );
}
