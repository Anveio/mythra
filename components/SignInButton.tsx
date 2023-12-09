import { clearCookie, getAuthorizationUrl, getUser } from "@/lib/auth";
import { Button } from "./ui/button";

export async function SignInButton() {
  const { isAuthenticated } = await getUser();
  const authorizationUrl = await getAuthorizationUrl();

  if (isAuthenticated) {
    return (
      <div>
        <form
          action={async () => {
            "use server";
            await clearCookie();
          }}
        >
          <Button type="submit">Sign Out</Button>
        </form>
      </div>
    );
  }

  return (
    <Button asChild>
      <a href={authorizationUrl}>Sign In</a>
    </Button>
  );
}
