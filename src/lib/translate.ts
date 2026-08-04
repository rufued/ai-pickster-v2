import "server-only";
import { supabaseAdmin } from "@/lib/supabase";
import type { Locale } from "@/i18n/config";

export type TranslatableContentType = "chat_message" | "pick_analysis";

const LANGUAGE_NAMES: Partial<Record<Locale, string>> = {
  en: "English", zh: "Simplified Chinese", ja: "Japanese", de: "German", fr: "French",
  pt: "Portuguese", es: "Spanish", vi: "Vietnamese", ar: "Arabic", ru: "Russian",
  tr: "Turkish", it: "Italian", hi: "Hindi", id: "Indonesian",
};

function buildPrompt(sourceText: string, locale: Locale) {
  const languageName = LANGUAGE_NAMES[locale] ?? locale;
  return `Translate the following Korean text into natural, fluent ${languageName}. Output only the translation with no quotes, labels, or extra commentary.\n\n${sourceText}`;
}

async function callGemini(prompt: string) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Gemini translate request failed (${response.status})`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || !text.trim()) throw new Error("Gemini returned an empty translation");
  return text.trim();
}

async function callOpenAi(prompt: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not configured");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, messages: [{ role: "user", content: prompt }] }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`OpenAI translate request failed (${response.status})`);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("OpenAI returned an empty translation");
  return text.trim();
}

async function translateViaApi(sourceText: string, locale: Locale) {
  const prompt = buildPrompt(sourceText, locale);
  try {
    return await callGemini(prompt);
  } catch (geminiError) {
    try {
      return await callOpenAi(prompt);
    } catch (openAiError) {
      throw new Error(`${geminiError instanceof Error ? geminiError.message : geminiError}; fallback: ${openAiError instanceof Error ? openAiError.message : openAiError}`);
    }
  }
}

/**
 * Returns the cached translation for (contentType, contentId, locale), translating and
 * caching it on first request. Korean locale and empty text short-circuit to the source
 * text; any lookup/API failure also falls back to the source text rather than throwing,
 * so a translation outage never breaks the page.
 */
export async function translateCached(params: { contentType: TranslatableContentType; contentId: string; locale: Locale; sourceText: string }): Promise<string> {
  const { contentType, contentId, locale, sourceText } = params;
  if (locale === "ko" || !sourceText.trim()) return sourceText;
  const admin = supabaseAdmin;
  if (!admin) return sourceText;
  try {
    const { data: cached, error: cacheError } = await admin
      .from("content_translations")
      .select("translated_text")
      .eq("content_type", contentType)
      .eq("content_id", contentId)
      .eq("locale", locale)
      .maybeSingle();
    if (cached?.translated_text) return cached.translated_text;
    if (cacheError && (cacheError.code === "42P01" || cacheError.code === "PGRST205" || /schema cache/i.test(cacheError.message ?? ""))) {
      // content_translations migration hasn't run yet; skip translating (and re-calling the API on
      // every request) until it exists, rather than serving uncached API calls.
      return sourceText;
    }

    const translated = await translateViaApi(sourceText, locale);
    const { error: insertError } = await admin
      .from("content_translations")
      .insert({ content_type: contentType, content_id: contentId, locale, translated_text: translated });
    if (insertError && insertError.code !== "23505") console.error("content_translations insert failed", insertError.message);
    return translated;
  } catch (error) {
    console.error(`translateCached failed for ${contentType}:${contentId}:${locale}`, error instanceof Error ? error.message : error);
    return sourceText;
  }
}

export async function translateManyCached(
  items: Array<{ contentType: TranslatableContentType; contentId: string; sourceText: string }>,
  locale: Locale,
): Promise<string[]> {
  if (locale === "ko") return items.map((item) => item.sourceText);
  return Promise.all(items.map((item) => translateCached({ ...item, locale })));
}
