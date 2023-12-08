"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@/icons/arrow-left";
import { ArrowRightIcon } from "@/icons/arrow-right";
import { EmailIcon } from "@/icons/email";
import { TrashIcon } from "@/icons/trash";
import Link from "next/link";
import { Search } from "./search";
import { deleteConversation } from "@/lib/db/queries";

type Params = {
  name: string;
};

export function Toolbar() {
  const params: Params = useParams();
  const searchParams = useSearchParams();
  const emailId = searchParams.get("id");

  return (
    <>
      <div className="space-x-1">
        <Link
          href={`/c/${params.name}/new`}
          className="inline-flex hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2"
        >
          <EmailIcon />
        </Link>
        <form
          className="inline-flex"
          onSubmit={async (e) => {
            e.preventDefault();

            if (emailId) {
              await deleteConversation(params.name, emailId);
            }
          }}
        >
          <button
            type="submit"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2"
          >
            <TrashIcon />
          </button>
        </form>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2">
          <ArrowLeftIcon />
        </button>
        <button className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-3 py-2">
          <ArrowRightIcon />
        </button>
      </div>
      <button className="flex ml-auto">
        <Search />
      </button>
    </>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 py-4 px-2 sticky top-0 h-[60px]" />
  );
}
