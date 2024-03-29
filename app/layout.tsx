// Import the base CSS styles for the radix-ui components.
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mythra Demo",
  description: "Infinite problems, infinite apps",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-white dark:bg-gray-950 text-black dark:text-white"
    >
      <body className={cn(GeistSans.variable, GeistSans.className, "h-screen")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
