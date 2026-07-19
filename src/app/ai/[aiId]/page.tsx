import { notFound } from "next/navigation";
import { AiPill, BetCard, DashboardShell, Metric, currency, percent, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getAi, getAis, getBetsByAi, getRanking } from "@/services/scorehub";

export function generateStaticParams() {
  return getAis().map((ai) => ({ aiId: ai.id }));
}

export default async function AiRecordPage({ params }: { params: Promise<{ aiId: string }> }) {
  const { aiId } = await params;
  const ai = getAi(aiId);
  const ranking = getRanking(aiId);
  if (!ai || !ranking) notFound();
  const bets = getBetsByAi(aiId).sort((a, b) => b.registeredAt.localeCompare(a.registeredAt));

  return (
    <DashboardShell title={`${ai.name} 기록실`} eyebrow="AI ledger" description={`${ai.style} 스타일의 가상 배팅 성과와 전체 내역입니다.`}>
      <section className="panel p-5">
        <AiPill aiId={ai.id} />
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-600">{ai.description}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-7">
          <Metric label="현재 자산" value={currency(ranking.currentBankroll)} />
          <Metric label="ROI" value={percent(ranking.roi)} tone={ranking.roi >= 0 ? "positive" : "negative"} />
          <Metric label="적중률" value={`${ranking.winRate.toFixed(1)}%`} />
          <Metric label="총 배팅" value={`${ranking.totalBets}`} />
          <Metric label="연속 적중" value={`${ranking.streak}`} />
          <Metric label="최고수익" value={signedCurrency(ranking.bestProfit)} tone="positive" />
          <Metric label="최대손실" value={signedCurrency(ranking.worstLoss)} tone="negative" />
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {bets.map((bet) => <BetCard key={bet.id} bet={bet} />)}
      </div>
    </DashboardShell>
  );
}
