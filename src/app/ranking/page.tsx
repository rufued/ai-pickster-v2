import { AiProfileCard } from "@/components/ai/AiProfileCard";
import { AiRankingCard } from "@/components/ai/AiRankingCard";
import { RankingTable } from "@/components/ranking/RankingTable";
import { getRankedAis } from "@/lib/data";
import { formatCurrency, formatPercent } from "@/lib/format";

export default function RankingPage() {
  const rankedAis = getRankedAis();
  const leader = rankedAis[0];

  return (
    <section className="container-shell py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-accent-green">AI Style Standings</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">AI 랭킹</h1>
        <p className="mt-3 text-slate-400">AI별 수익률뿐 아니라 분석 스타일, 투자 철학, 대표 특징을 함께 비교합니다.</p>
      </div>

      <div className="panel mb-8 overflow-hidden">
        <div className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-400">현재 1위 AI</p>
            <h2 className="mt-3 text-4xl font-black text-white">{leader.name}</h2>
            <p className="mt-3 text-slate-400">
              {leader.analysisStyle} 관점으로 {formatCurrency(leader.startingBalance)}에서 시작해 현재 {formatCurrency(leader.currentBalance)}까지
              상승했습니다.
            </p>
            <div className="mt-5 rounded-lg border border-accent-green/20 bg-accent-green/10 p-4">
              <p className="text-xs font-bold text-accent-green">투자 철학</p>
              <p className="mt-1 font-semibold text-white">{leader.investmentPhilosophy}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Highlight label="현재 자산" value={formatCurrency(leader.currentBalance)} />
            <Highlight label="ROI" value={formatPercent(leader.roi)} positive />
            <Highlight label="분석 스타일" value={leader.analysisStyle} />
            <Highlight label="최고 배당 적중" value={leader.bestHitOdds.toFixed(2)} positive />
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {rankedAis.map((ai) => (
          <AiProfileCard key={ai.id} ai={ai} />
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {rankedAis.map((ai, index) => (
          <AiRankingCard key={ai.id} ai={ai} rank={index + 1} />
        ))}
      </div>

      <RankingTable ais={rankedAis} />
    </section>
  );
}

function Highlight({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={positive ? "mt-2 text-2xl font-black text-emerald-300" : "mt-2 text-2xl font-black text-white"}>{value}</p>
    </div>
  );
}
