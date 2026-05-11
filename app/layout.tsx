import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendLens — Free AI Tool Spend Audit",
  description: "Find out if you're overpaying for AI tools. Free instant audit, no login required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif", margin: 0 }}>{children}</body>
    </html>
  );
}
