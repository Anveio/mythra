import Link from "next/link";
import { getConversationsByUserPrivateId } from "@/lib/db/queries";
import { getUser } from "@/lib/auth";
import { Button } from "./ui/button";

export async function ConversationListColumn({
  searchParams,
}: {
  searchParams: { q?: string; id?: string };
}) {
  const { isAuthenticated, user } = await getUser();

  if (!isAuthenticated || !user) {
    return <div />;
  }

  const conversations = await getConversationsByUserPrivateId(user.id);

  function createUrl(id: string) {
    const baseUrl = `/c`;
    const params = new URLSearchParams(searchParams);
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
          <Button>New</Button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {conversations.map((conversation) => (
          <Link
            key={conversation.publicId}
            href={createUrl(conversation.publicId)}
          >
            <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-start rounded-lg">
              <div className="w-full truncate">
                <h2 className="text-base font-bold">{conversation.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversation.userPrivateId}
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
