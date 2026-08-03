import { AdSlot } from "@/components/ads/AdSlot";
import { BettingRecordBoard } from "@/components/scorehub/BettingRecordBoard";
import { DashboardShell, Metric, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export default async function RecordsPage() {
  const { ais, bets, rankings } = await getLiveData();
  const totalBets = rankings.reduce((sum, item) => sum + item.totalBets, 0);
  const averageRoi = rankings.length ? rankings.reduce((sum, item) => sum + item.roi, 0) / rankings.length : 0;
  const best = rankings[0];
  const worst = [...rankings].sort((a, b) => a.totalProfit - b.totalProfit)[0];

  return (
    <DashboardShell title="AI 베팅내역" eyebrow="Ledger" description="AI별 가상 베팅 기록과 결과를 카드형 장부로 확인합니다. 실제 베팅, 충전, 환전 기능은 없습니다.">
      <AdSlot placement="records_top" />
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        <Metric label="현재 자산" value={currency(rankings.reduce((sum, item) => sum + item.currentBankroll, 0))} />
        <Metric label="ROI" value={percent(averageRoi)} tone={averageRoi >= 0 ? "positive" : "negative"} />
        <Metric label="평균 적중률" value={`${(rankings.reduce((sum, item) => sum + item.winRate, 0) / rankings.length).toFixed(1)}%`} />
        <Metric label="총 베팅" value={`${totalBets}`} />
        <Metric label="연속 적중" value={`${best?.streak ?? 0}`} />
        <Metric label="최고수익" value={signedCurrency(best?.bestProfit ?? 0)} tone="positive" />
        <Metric label="최대손실" value={signedCurrency(worst?.worstLoss ?? 0)} tone="negative" />
      </div>
      {bets.length ? <BettingRecordBoard bets={bets} ais={ais} /> : <div className="panel p-8 text-center text-sm font-bold text-slate-500">아직 생성된 픽이 없습니다.</div>}
    </DashboardShell>
  );
}
