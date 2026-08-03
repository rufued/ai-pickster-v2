import { headers } from "next/headers";
import { defaultLocale, getMessage, isLocale, type Locale } from "@/i18n/config";

export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get("x-app-locale");
  return isLocale(value) ? value : defaultLocale;
}

export async function getTranslations() {
  const locale = await getLocale();
  return (key: string, values?: Record<string, string | number>) => getMessage(locale, key, values);
}
