import { getUser } from "@/lib/auth";
import { getMessagesInConversation } from "@/lib/db/queries";
import ChatBox from "./ChatBox";
import { EmailEmptyView } from "./email-empty-view";
export async function SelectedEmailColumn({
  searchParams,
}: {
  searchParams: { q?: string; id?: string };
}) {
  const { isAuthenticated, user } = await getUser();

  if (!isAuthenticated || !user) {
    return <EmailEmptyView />;
  }

  const messages = searchParams.id
    ? await getMessagesInConversation(user.id, searchParams.id)
    : [];

  return <ChatBox />;
}
