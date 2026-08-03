import en from "../../messages/en.json";
import ko from "../../messages/ko.json";
import zh from "../../messages/zh.json";
import ja from "../../messages/ja.json";
import de from "../../messages/de.json";
import fr from "../../messages/fr.json";
import pt from "../../messages/pt.json";
import es from "../../messages/es.json";
import vi from "../../messages/vi.json";
import ar from "../../messages/ar.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import it from "../../messages/it.json";
import hi from "../../messages/hi.json";
import id from "../../messages/id.json";

export const locales = ["ko", "en", "zh", "ja", "de", "fr", "pt", "es", "vi", "ar", "ru", "tr", "it", "hi", "id"] as const;
export type Locale = (typeof locales)[number];
export type Messages = typeof ko;

export const defaultLocale: Locale = "en";
export const messages: Record<Locale, Messages> = { ko, en, zh, ja, de, fr, pt, es, vi, ar, ru, tr, it, hi, id };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getMessage(locale: Locale, key: string, values?: Record<string, string | number>) {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, messages[locale]);
  const fallback = key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, messages.en);
  const text = typeof value === "string" ? value : typeof fallback === "string" ? fallback : key;
  return Object.entries(values ?? {}).reduce((result, [name, replacement]) => result.replaceAll(`{${name}}`, String(replacement)), text);
}

export function localizeSport(locale: Locale, sport: string) {
  const keys: Record<string, string> = { "축구": "sports.soccer", "야구": "sports.baseball", "농구": "sports.basketball", "E스포츠": "sports.esports", "e스포츠": "sports.esports", "배구": "sports.volleyball", "아이스하키": "sports.hockey", "미식축구": "sports.football" };
  return keys[sport] ? getMessage(locale, keys[sport]) : sport;
}

export function localizeMarket(locale: Locale, market: string) {
  const normalized = market.toLowerCase();
  if (market === "핸디캡" || normalized === "spread") return getMessage(locale, "markets.spread");
  if (market === "언더오버" || normalized === "total") return getMessage(locale, "markets.total");
  if (market === "승무패" || normalized === "moneyline") return getMessage(locale, "markets.moneyline");
  return market;
}
