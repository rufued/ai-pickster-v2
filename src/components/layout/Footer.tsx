import Link from "next/link";
import { SCOREHUB } from "@/lib/brand";
import { getTranslations } from "@/i18n/server";

export async function Footer() {
  const t = await getTranslations();
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container-shell flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-700">{SCOREHUB.name}</p>
        <p>{t("brand.slogan")} · {t("brand.footer")} · {t("brand.logos")}: <a href="https://www.thesportsdb.com" target="_blank" rel="noreferrer" className="font-bold underline">TheSportsDB</a></p>
        <p className="flex items-center gap-3">
          <Link href="/terms" className="font-bold text-slate-600 underline hover:text-slate-900">{t("brand.terms")}</Link>
          <Link href="/privacy" className="font-bold text-slate-600 underline hover:text-slate-900">{t("brand.privacy")}</Link>
        </p>
      </div>
    </footer>
  );
}
