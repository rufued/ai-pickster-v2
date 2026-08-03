import "./globals.css";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SCOREHUB } from "@/lib/brand";
import { AdPlaceholder } from "@/components/ads/AdSlot";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { getLocale } from "@/i18n/server";

export const metadata: Metadata = {
  title: SCOREHUB.name,
  description: "AI sports prediction and virtual betting performance dashboard.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <I18nProvider locale={locale}>
          <Header />
          <div className="container-shell py-3"><AdPlaceholder placement="global_header" /></div>
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
