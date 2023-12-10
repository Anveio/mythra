import { getUser } from "@/lib/auth";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { SignedIn } from "../SignedIn";
import { ConversationsList } from "./ConversationsList";
import { MobileSidebar } from "./MobileSidebar";
import { ProfileButton } from "./ProfileButton";
import { Button } from "../ui/button";
import { NewConversationButton } from "./NewConversationButton";

export function Sidebar() {
  return (
    <div>
      <MobileSidebar>
        <SidebarCore shouldGenerateConversationTitles={false} />
      </MobileSidebar>
      <SidebarCore
        shouldGenerateConversationTitles={true}
        className="hidden md:flex"
      />
    </div>
  );
}

interface Props {
  shouldGenerateConversationTitles: boolean;
  className?: string;
  closeOnNavChange?: boolean;
}

async function SidebarCore(props: Props) {
  const { user } = await getUser();

  return (
    <div
      className={clsx(
        "fixed top-0 z-40 flex h-[100dvh] w-[15rem] flex-col bg-gray-900",
        props.className
      )}
    >
      <div className="flex grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4 ring-1 ring-white/10">
        <nav className="flex flex-1 flex-col">
          <SignedIn>
            <NewConversationButton />
          </SignedIn>
          <ul role="list" className="flex flex-1 flex-col gap-y-0">
            <li>
              <ConversationsList isSignedIn={!!user} />
            </li>
          </ul>
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
