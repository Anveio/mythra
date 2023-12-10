import { getUser } from "@/lib/auth";

export async function SignedOut({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = await getUser();

  if (isAuthenticated || user) {
    return null;
  }

  return <>{children}</>;
}
