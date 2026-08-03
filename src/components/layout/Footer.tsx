import { SCOREHUB } from "@/lib/brand";
import { getTranslations } from "@/i18n/server";

export async function Footer() {
  const t = await getTranslations();
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container-shell flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-700">{SCOREHUB.name}</p>
        <p>{t("brand.slogan")} · {t("brand.footer")} · {t("brand.logos")}: <a href="https://www.thesportsdb.com" target="_blank" rel="noreferrer" className="font-bold underline">TheSportsDB</a></p>
      </div>
    </footer>
  );
}
