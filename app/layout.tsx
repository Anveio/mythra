// Import the base CSS styles for the radix-ui components.
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import { getUser } from "@/lib/auth";
import { SignInButton } from "@/components/SignInButton";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavMenuOpener } from "@/components/Sidebar/MobileNavMenuOpener";
export const metadata: Metadata = {
  title: "Mythra Demo",
  description: "Infinite problems, infinite apps",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = await getUser();

  console.log("Authenticated: ", isAuthenticated);

  return (
    <html
      lang="en"
      className="bg-white dark:bg-gray-950 text-black dark:text-white"
    >
      <body className={GeistSans.variable}>
        <div className="static md:grid md:grid-cols-[15rem_1fr]">
          <Sidebar />
          <div>
            <div className="grid grid-rows-[min-content_1fr] md:grid-rows-1">
              <div className="border-b-1 border-b">
                <div className="max-w-7xl h-14 w-full mx-auto flex p-4 justify-between items-center">
                  <h1 className="text-xl font-semibold">Mythra</h1>
                  <div className="flex items-center">
                    <SignInButton />
                    <MobileNavMenuOpener />
                  </div>
                </div>
              </div>
              <div className="max-w-7xl w-full mx-auto min-h-[100dvh]">
                {!isAuthenticated || !user ? (
                  <div className="max-h-[calc(100vh-56px)] h-screen">
                    <div className="p-6">
                      <h2 className="text-4xl font-semibold text-center">
                        Infinite problems, infinite apps.
                      </h2>
                      <div className="my-4"></div>
                      <div className="flex flex-col max-w-xl justify-center m-auto">
                        <div className="space-y-4 text-lg">
                          <p className="text-center mb-2 font-semibold">
                            Mythra is the concept of an internet of AI apps
                            connected by a protocol akin to HTTP
                          </p>
                          <p>
                            Todays large language models are hosted on websites
                            or apps that also dictate the user experience. Even
                            with plugins or function invocations this pattern is
                            akin to a web browser only being able to render text
                            retrieved from websites rather than displaying the
                            website itself.
                          </p>
                          <p>
                            We propose a new paradigm where language models are
                            fine-tuned to treat a user's prompt as a request to
                            be served the best app to solve their problem. The
                            user's text input, therefore, becomes a
                            natural-language address bar.
                          </p>
                          <p>
                            Consider the query "What's the weather in Seattle?"
                            Today's language models respond "I don't know". With
                            plugins configured, the language model may invoke a
                            function to fetch that information from a service
                            and display the result to the user as text.
                          </p>
                          <p>
                            In this new paradigm, the language model would
                            instead search through a repository of apps and
                            output text in the following format:{" "}
                            <pre>ai://universal_resource_locator</pre>
                            where "universal_resource_locator" would be akin to
                            a traditional domain name. The user's browser would
                            handle this similarly to navigating to a website and
                            replace the text with the contents of the app
                            retrievable at that URL.
                          </p>
                          <p>
                            The served app is interactive through traditional
                            means and would expose to the language model a list
                            of parameters and commands it's capable of handling
                            (a manifest). Subsequent text prompts from the user
                            should be forwarded to the app but first translated
                            by the language model into a function call from the
                            manifest. The user can choose to exit the app at any
                            time or request the language model find a different
                            app.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  children
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
