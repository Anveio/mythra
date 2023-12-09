// Import the base CSS styles for the radix-ui components.
import "@radix-ui/themes/styles.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import { getUser } from "@/lib/auth";
import { Theme, Container, Card, Flex } from "@radix-ui/themes";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
export const metadata: Metadata = {
  title: "Mythra Demo",
  description: "Infinite problems, infinite apps",
};

export default async function RootLayout({
  children,
  conversation,
}: {
  children: React.ReactNode;
  conversation: React.ReactNode;
}) {
  const { isAuthenticated, user } = await getUser();

  console.log("Authenticated: ", isAuthenticated);

  if (!isAuthenticated || !user) {
    return (
      <html
        lang="en"
        className="bg-white dark:bg-gray-950 text-black dark:text-white"
      >
        <body className={GeistSans.variable}>
          <Theme
            accentColor="bronze"
            style={{ backgroundColor: "var(--gray-1)" }}
          >
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
                  <div>
                    <Card size="4" style={{ width: "100%" }}>
                      <div>
                        <Header />

                        <main>
                          <div>
                            <div>
                              <Hero />
                              <div className="grid grid-cols-3 gap-4">
                                <div />
                              </div>
                            </div>
                          </div>
                        </main>
                      </div>
                    </Card>
                  </div>
                </Flex>
              </Flex>
            </Container>
          </Theme>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className="bg-white dark:bg-gray-950 text-black dark:text-white"
    >
      <body className={GeistSans.variable}>
        <div className="h-14 border-b-1 border-b">
          <div className="px-4"></div>
        </div>
        <div className="grid grid-cols-[minmax(200px,1fr)_3fr] max-h-[calc(100vh-56px)] h-screen">
          {conversation}
          {children}
        </div>
      </body>
    </html>
  );
}
