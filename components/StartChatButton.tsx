import { Button } from "./ui/button";
import Link from "next/link";

export async function StartChatButton() {
  return (
    <Button asChild>
      <Link href={"/chat"}>Chat</Link>
    </Button>
  );
}
