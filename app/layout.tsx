import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalGTM AI — Evidence-first market entry copilot",
  description: "Turn a product and target market into an auditable go-to-market recommendation.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
