import { AdSlot } from "@/components/ads/AdSlot";
import { BettingRecordBoard } from "@/components/scorehub/BettingRecordBoard";
import { DashboardShell, Metric, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData, getSettledRecords } from "@/lib/live-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function RecordsPage() {
  const { ais, bets, rankings } = await getLiveData();
  const settled = getSettledRecords(bets);
  const wins = settled.filter((bet) => bet.status === "won").length;
  const averageRoi = rankings.length ? rankings.reduce((sum, item) => sum + item.roi, 0) / rankings.length : 0;
  const profits = settled.map((bet) => bet.profit);

  return (
    <DashboardShell
      title="AI 베팅내역"
      eyebrow="Betting ledger"
      description="승패 결과가 나온 정산 완료 배팅 기록만 표시합니다. 예정 중인 픽은 AI 픽 조합에서 확인할 수 있습니다."
    >
      <AdSlot placement="records_top" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="전체 AI 자산" value={currency(rankings.reduce((sum, item) => sum + item.currentBankroll, 0))} />
        <Metric label="평균 ROI" value={percent(averageRoi)} tone={averageRoi >= 0 ? "positive" : "negative"} />
        <Metric label="정산 적중률" value={`${settled.length ? ((wins / settled.length) * 100).toFixed(1) : "0.0"}%`} />
        <Metric label="정산 완료 베팅" value={`${settled.length}`} />
        <Metric label="최고 단일 손익" value={profits.length ? signedCurrency(Math.max(...profits)) : "$0"} tone={profits.length && Math.max(...profits) < 0 ? "negative" : "positive"} />
      </div>
      <BettingRecordBoard bets={settled} ais={ais} />
    </DashboardShell>
  );
}
