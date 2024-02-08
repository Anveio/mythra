import { getUser } from "@/lib/auth";
import clsx from "clsx";
import { SignedIn } from "../SignedIn";
import { MobileSidebar } from "./MobileSidebar";
import { NewConversationButton } from "./NewConversationButton";
import { ProfileButton } from "./ProfileButton";
import dynamic from "next/dynamic";

const DynamicConversationsList = dynamic(
  () => import("./ConversationsList").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export function Sidebar() {
  return <SidebarCore />;
}

async function SidebarCore() {
  const { user } = await getUser();

  return (
    <div className={clsx("z-40 flex-col bg-gray-900 hidden md:flex")}>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 ring-1 ring-white/10">
        <nav className="flex flex-1 flex-col">
          <SignedIn>
            <NewConversationButton />
          </SignedIn>
          <DynamicConversationsList />
        </nav>
      </div>

      <div className="mt-auto grid gap-3 bg-inherit text-indigo-200">
        <SignedIn>
          <ProfileButton
            username={user ? `${user.firstName} ${user.lastName}` : null}
          />
        </SignedIn>
      </div>
    </div>
  );
}
