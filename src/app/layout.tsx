import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SCOREHUB } from "@/lib/brand";
import { AdPlaceholder } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: SCOREHUB.name,
  description: "AI sports prediction and virtual betting performance dashboard.",
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
        <div className="container-shell py-3">
          <AdPlaceholder placement="global_header" />
        </div>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
