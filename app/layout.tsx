// Import the base CSS styles for the radix-ui components.
import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mythra Demo",
  description: "Infinite problems, infinite apps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 0, margin: 0 }}>
        <Theme accentColor="iris" style={{ backgroundColor: "var(--gray-1)" }}>
          {children}
        </Theme>
      </body>
    </html>
  );
}
