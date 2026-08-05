import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
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
  const requestHeaders = await headers();
  const isAdminArea = requestHeaders.get("x-admin-area") === "1";
  const isAdminPath = requestHeaders.get("x-admin-path") === "1";
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        {gaId && !isAdminPath ? <GoogleAnalytics measurementId={gaId} /> : null}
        <I18nProvider locale={locale}>
          {isAdminArea ? (
            <>
              <AdminHeader />
              <main>{children}</main>
            </>
          ) : (
            <>
              <Header />
              <div className="container-shell py-3"><AdPlaceholder placement="global_header" /></div>
              <main>{children}</main>
              <Footer />
            </>
          )}
        </I18nProvider>
      </body>
    </html>
  );
}
