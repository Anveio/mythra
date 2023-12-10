import { getUser } from "@/lib/auth";
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
  return;
}
