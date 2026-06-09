import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SCOREHUB } from "@/lib/brand";

export const metadata: Metadata = {
  title: SCOREHUB.name,
  description: "실시간 스포츠 스코어, 경기 일정, AI 분석 및 스포츠 커뮤니티 플랫폼",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
