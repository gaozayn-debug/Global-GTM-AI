import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalGTM AI — 出海利润实验室",
  description: "输入成本，验证出海定价、渠道与试销盈亏。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
