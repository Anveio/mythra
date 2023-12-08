import { getUser } from "@/lib/auth";
import { Button, Flex } from "@radix-ui/themes";
import NextLink from "next/link";
import { SignInButton } from "./SignInButton";


export const Header = async () => {
  const { isAuthenticated, user } = await getUser();

  return isAuthenticated ? (
    <Flex asChild justify="between">
      <header>
        <Flex gap="4">
          <Button asChild variant="soft">
            <NextLink href="/">Home</NextLink>
          </Button>

          <Button asChild variant="soft">
            <NextLink href="/account">Account</NextLink>
          </Button>
        </Flex>

        <SignInButton />
      </header>
    </Flex>
  ) : (
    <div />
  );
};
