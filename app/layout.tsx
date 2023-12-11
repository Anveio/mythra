// Import the base CSS styles for the radix-ui components.
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import { getUser } from "@/lib/auth";
import { SignInButton } from "@/components/SignInButton";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavMenuOpener } from "@/components/Sidebar/MobileNavMenuOpener";
import { cn } from "@/lib/utils";
import { Whitepaper } from "@/components/Whitepaper";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
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
      <body className={cn(GeistSans.variable, GeistSans.className)}>
        <div className="static md:grid md:grid-cols-[15rem_1fr]">
          <Sidebar />
          <div>
            <div className="grid grid-rows-[min-content_1fr] md:grid-rows-1">
              <div className="border-b-1 border-b shadow-sm">
                <div className="max-w-4xl h-14 mx-auto flex p-4 justify-between items-center ">
                  <Link href={"/about"}>
                    <h1 className="text-xl font-semibold">Mythra</h1>
                  </Link>
                  <div className="flex items-center">
                    <SignInButton />
                    <MobileNavMenuOpener />
                  </div>
                </div>
              </div>
              <div className="max-w-4xl mx-auto min-h-[100dvh]">
                {!isAuthenticated || !user ? <Whitepaper /> : children}
              </div>
            </div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
