import Link from "next/link";
import { getUser } from "@/lib/auth";
import { Button } from "./ui/button";
import { getConversationsByUserId } from "@/lib/db/queries";

export async function ConversationListColumn() {
  const { isAuthenticated, user } = await getUser();

  if (!isAuthenticated || !user) {
    return <div />;
  }

  const conversations = await getConversationsByUserId(user.id);

  function createUrl(id: string) {
    const baseUrl = `/c`;
    const params = new URLSearchParams();
    params.set("id", id);
    return `${baseUrl}?${params}`;
  }

  return (
    <div className="w-full border-r border-gray-200  dark:border-gray-800">
      <div className="border-b-[1px]">
        <div className="flex p-2 justify-between items-center  overflow-y-auto px-2">
          <h2 className="text-lg font-semibold text-black dark:text-gray-400">
            Conversations
          </h2>
          <Button variant={"secondary"}>New</Button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {conversations.map((conversation) => (
          <Link key={conversation.id} href={createUrl(conversation.id)}>
            <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-start rounded-lg">
              <div className="w-full truncate">
                <h2 className="text-base font-bold">{conversation.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversation.userId}
                </p>
                <p className="text-sm truncate overflow-ellipsis">
                  {conversation.title}
                </p>
              </div>
              <time className="text-xs text-gray-500 dark:text-gray-400 self-center flex justify-end">
                {conversation.createdAt.toLocaleDateString()}
              </time>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
