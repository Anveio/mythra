import { getUser } from "@/lib/auth";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import { SignInButton } from "./SignInButton";

export const Hero = async () => {
  const { isAuthenticated, user } = await getUser();

  return isAuthenticated ? (
    <Heading
      size="8"
      mb="8"
      style={{
        textAlign: "center",
      }}
    >
      Welcome back
      {user?.firstName && `, ${user?.firstName}`}
    </Heading>
  ) : (
    <Flex direction={"column"} grow="1" align="center" justify="center">
      <Heading size="8" mb="6">
        Mythra
      </Heading>
      <Text size="5" color="gray">
        Infinite problems
      </Text>
      <Text size="5" color="gray" mb="4">
        Infinite apps
      </Text>
      <SignInButton large />
    </Flex>
  );
};
