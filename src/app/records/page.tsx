import { AdSlot } from "@/components/ads/AdSlot";
import { BettingRecordBoard } from "@/components/scorehub/BettingRecordBoard";
import { DashboardShell, Metric, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData, getSettledRecords } from "@/lib/live-data";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function RecordsPage() {
  const t = await getTranslations();
  const { ais, bets, rankings } = await getLiveData();
  const settled = getSettledRecords(bets);
  const wins = settled.filter((bet) => bet.status === "won").length;
  const averageRoi = rankings.length ? rankings.reduce((sum, item) => sum + item.roi, 0) / rankings.length : 0;
  const profits = settled.map((bet) => bet.profit);

  return (
    <DashboardShell
      title={t("records.title")}
      eyebrow="Betting ledger"
      description={t("records.description")}
    >
      <AdSlot placement="records_top" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label={t("records.allAssets")} value={currency(rankings.reduce((sum, item) => sum + item.currentBankroll, 0))} />
        <Metric label={t("records.averageRoi")} value={percent(averageRoi)} tone={averageRoi >= 0 ? "positive" : "negative"} />
        <Metric label={t("records.settledRate")} value={`${settled.length ? ((wins / settled.length) * 100).toFixed(1) : "0.0"}%`} />
        <Metric label={t("records.settledBets")} value={`${settled.length}`} />
        <Metric label={t("records.bestProfit")} value={profits.length ? signedCurrency(Math.max(...profits)) : "$0"} tone={profits.length && Math.max(...profits) < 0 ? "negative" : "positive"} />
      </div>
      <BettingRecordBoard bets={settled} ais={ais} />
    </DashboardShell>
  );
}
