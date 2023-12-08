import { Button, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import NextLink from "next/link";
import { SignInButton } from "@/components/SignInButton";
import { getUser } from "@/lib/auth";
import { Footer } from "@/components/Footer";
import ChatBox from "@/components/ChatBox";

export default async function HomePage() {
  const { isAuthenticated, user } = await getUser();

  return (
    <Container px="5">
      <Flex align="center" style={{ height: "100vh" }} py="9">
        <Flex
          direction="column"
          style={{
            height: "100%",
            maxHeight: 850,
            minHeight: 500,
            width: "100%",
          }}
          gap="5"
        >
          <Flex grow="1">
            <Card size="4" style={{ width: "100%" }}>
              <Flex direction="column" height="100%">
                {isAuthenticated ? (
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
                )}

                <Flex grow="1" align="center" justify="center">
                  <main>
                    <Flex direction="column" align="center" gap="2">
                      {isAuthenticated ? (
                        <>
                          <Heading size="8">
                            Welcome back
                            {user?.firstName && `, ${user?.firstName}`}
                          </Heading>
                          <ChatBox />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </Flex>
                  </main>
                </Flex>
              </Flex>
            </Card>
          </Flex>
          <Footer />
        </Flex>
      </Flex>
    </Container>
  );
}
