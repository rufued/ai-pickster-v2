import { AdSlot } from "@/components/ads/AdSlot";
import { BettingRecordBoard } from "@/components/scorehub/BettingRecordBoard";
import { DashboardShell, Metric, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export default async function RecordsPage() {
  const { ais, bets, rankings } = await getLiveData();
  const settled = bets.filter((bet) => bet.status === "won" || bet.status === "lost");
  const wins = settled.filter((bet) => bet.status === "won").length;
  const averageRoi = rankings.length ? rankings.reduce((sum, item) => sum + item.roi, 0) / rankings.length : 0;
  const profits = settled.map((bet) => bet.profit);

  return (
    <DashboardShell
      title="AI 베팅내역"
      eyebrow="Betting ledger"
      description="AI의 단일 픽과 여러 경기를 묶은 조합 베팅을 실제 정산 데이터 기준으로 확인합니다."
    >
      <AdSlot placement="records_top" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Metric label="전체 AI 자산" value={currency(rankings.reduce((sum, item) => sum + item.currentBankroll, 0))} />
        <Metric label="평균 ROI" value={percent(averageRoi)} tone={averageRoi >= 0 ? "positive" : "negative"} />
        <Metric label="정산 적중률" value={`${settled.length ? ((wins / settled.length) * 100).toFixed(1) : "0.0"}%`} />
        <Metric label="전체 베팅" value={`${bets.length}`} />
        <Metric label="최고 단일 손익" value={profits.length ? signedCurrency(Math.max(...profits)) : "$0"} tone={profits.length && Math.max(...profits) < 0 ? "negative" : "positive"} />
      </div>
      <BettingRecordBoard bets={bets} ais={ais} />
    </DashboardShell>
  );
}
