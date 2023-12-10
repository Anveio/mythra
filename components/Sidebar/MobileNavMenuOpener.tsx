"use client";

import { useMobileNavStore } from "@/lib/mobile-nav-state";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

export function MobileNavMenuOpener() {
  const { open } = useMobileNavStore();
  return (
    <Button
      variant={"outline"}
      type="button"
      onClick={open}
      className="-m-2.5 ml-2 text-zinc-500 shrink-0 p-2.5 focus-visible:outline-blue-600 md:hidden"
    >
      <span className="sr-only">Open sidebar</span>
      <Menu className="h-6 w-6" aria-hidden="true" />
    </Button>
  );
}
