import { notFound } from "next/navigation";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { AiFilterLinks, HistoryHeader, HistoryTable } from "@/components/history/HistoryViews";
import { aiModels, getAiById, getCombosByAi } from "@/lib/data";
import { formatCurrency, formatPercent, formatSignedCurrency } from "@/lib/format";

type AiHistoryPageProps = {
  params: Promise<{
    ai: string;
  }>;
};

export function generateStaticParams() {
  return aiModels.map((ai) => ({ ai: ai.id }));
}

export default async function AiHistoryPage({ params }: AiHistoryPageProps) {
  const { ai: aiId } = await params;
  const ai = getAiById(aiId);

  if (!ai) {
    notFound();
  }

  const combinations = getCombosByAi(ai.id).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="container-shell py-8">
      <HistoryHeader title={`${ai.name} 배팅기록실`} description={`${ai.name}가 만든 배팅 조합만 따로 모아봅니다.`} />

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold text-slate-500">AI</p>
          <div className="mt-2"><AiIdentity name={ai.name} showBadge={false} nameClassName="text-xl" /></div>
        </article>
        <Metric label="현재 자산" value={formatCurrency(ai.currentBankroll)} />
        <Metric label="ROI" value={formatPercent(ai.roi)} tone={ai.roi >= 0 ? "positive" : "negative"} />
        <Metric label="누적 수익" value={formatSignedCurrency(ai.totalProfit)} tone={ai.totalProfit >= 0 ? "positive" : "negative"} />
        <Metric label="적중률" value={formatPercent(ai.winRate)} />
        <Metric label="총 배팅 횟수" value={`${ai.totalBets}회`} />
        <Metric label="총 픽 수" value={`${ai.totalPicks}개`} />
        <Metric label="배팅 성향" value={ai.bettingStyle} small />
      </div>

      <AiFilterLinks active={ai.id} />
      <HistoryTable combinations={combinations} />
    </section>
  );
}

function Metric({ label, value, tone, small }: { label: string; value: string; tone?: "positive" | "negative"; small?: boolean }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={tone === "positive" ? "mt-2 text-2xl font-black text-emerald-600" : tone === "negative" ? "mt-2 text-2xl font-black text-red-600" : small ? "mt-2 text-sm font-black leading-5 text-slate-950" : "mt-2 text-2xl font-black text-slate-950"}>{value}</p>
    </article>
  );
}
