"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Cog } from "lucide-react";

interface Props {
  username: string | undefined | null;
}

export function ProfileButton(props: Props) {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-[1fr_min-content] divide-x divide-white/10 ring-1 ring-white/10 group-hover:text-white"
      )}
    >
      <Link href={"/"}>
        <div className="flex items-center p-2 space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>RK</AvatarFallback>
          </Avatar>
          <span>{props.username || null}</span>
        </div>
      </Link>
      <Link
        href={"/"}
        className={cn(
          "group flex items-center gap-x-3 p-4 text-lg font-semibold leading-6 hover:text-white md:text-sm"
        )}
      >
        <Cog className="h-6 w-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">Settings</span>
      </Link>
    </motion.div>
  );
}
