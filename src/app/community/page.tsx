import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getTranslations } from "@/i18n/server";

export default async function CommunityPage() {
  const t = await getTranslations();
  return (
    <DashboardShell title={t("community.title")} eyebrow="Community" description={t("community.description")}>
      <div className="panel p-12 text-center">
        <p className="font-black text-slate-800">{t("community.empty")}</p>
        <p className="mt-2 text-sm font-medium text-slate-500">{t("community.emptyDesc")}</p>
      </div>
    </DashboardShell>
  );
}
