import { getUser } from "@/lib/auth";
import { conversations, db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const ConversationsList = async () => {
  const { isAuthenticated, user } = await getUser();

  if (!isAuthenticated || !user) {
    return <div />;
  }

  const conversations = await getConversationsByPrivateId(user.id);

  if (conversations.length === 0) {
    return <div>No conversations</div>;
  }

  return (
    <ol>
      {conversations.map((conversation) => (
        <li key={conversation.id}>{conversation.title}</li>
      ))}
    </ol>
  );
};

const getConversationsByPrivateId = async (privateId: string) => {
  return db
    .select({
      id: conversations.id,
      userPrivateId: conversations.userPrivateId,
      title: conversations.title,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .where(eq(conversations.userPrivateId, privateId));
};
