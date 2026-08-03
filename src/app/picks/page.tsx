import { AdSlot } from "@/components/ads/AdSlot";
import { PendingPicksBoard } from "@/components/scorehub/PendingPicksBoard";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData, getPendingPicks } from "@/lib/live-data";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PicksPage() {
  const t = await getTranslations();
  const { ais, bets } = await getLiveData();
  const upcoming = getPendingPicks(bets);

  return (
    <DashboardShell title={t("picks.title")} eyebrow={t("picks.eyebrow")} description={t("picks.description")}>
      <AdSlot placement="picks_top" />
      <PendingPicksBoard bets={upcoming} ais={ais} />
    </DashboardShell>
  );
}
