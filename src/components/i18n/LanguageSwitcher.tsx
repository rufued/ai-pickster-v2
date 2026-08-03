"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import { isLocale } from "@/i18n/config";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const router = useRouter();
  return (
    <label className="inline-flex h-10 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 text-sm font-bold text-slate-700">
      <Languages size={15} className="text-blue-600" />
      <span className="sr-only">{t("language.label")}</span>
      <select
        aria-label={t("language.label")}
        className="bg-transparent text-xs font-black outline-none"
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value;
          if (!isLocale(nextLocale)) return;
          document.cookie = `locale=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
          router.refresh();
        }}
      >
        <option value="ko">🇰🇷 한국어</option>
        <option value="en">🇺🇸 English</option>
        <option value="zh">🇨🇳 中文</option>
        <option value="ja">🇯🇵 日本語</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="pt">🇵🇹 Português</option>
        <option value="es">🇪🇸 Español</option>
        <option value="vi">🇻🇳 Tiếng Việt</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
    </label>
  );
}
