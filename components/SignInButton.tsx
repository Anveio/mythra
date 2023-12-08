import { clearCookie, getAuthorizationUrl, getUser } from "@/lib/auth";
import { Button, Flex } from "@radix-ui/themes";

export async function SignInButton({ large }: { large?: boolean }) {
  const { isAuthenticated } = await getUser();
  const authorizationUrl = await getAuthorizationUrl();

  if (isAuthenticated) {
    return (
      <Flex gap="3">
        <form
          action={async () => {
            "use server";
            await clearCookie();
          }}
        >
          <Button type="submit" size={large ? "3" : "2"}>
            Sign Out
          </Button>
        </form>
      </Flex>
    );
  }

  return (
    <Button asChild size={large ? "3" : "2"}>
      <a href={authorizationUrl}>Sign In</a>
    </Button>
  );
}
