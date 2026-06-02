import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Swords } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { aiCompetitors, analysisMatches, getAnalysisMatch } from "@/lib/data";
import { formatDateTime, formatSignedCurrency } from "@/lib/format";

type BattleDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return analysisMatches.map((match) => ({ id: match.id }));
}

export default async function BattleDetailPage({ params }: BattleDetailPageProps) {
  const { id } = await params;
  const match = getAnalysisMatch(id);

  if (!match) {
    notFound();
  }

  const winners = match.actualResult
    ? match.analyses.filter((analysis) => analysis.prediction === match.actualResult)
    : [];
  const losers = match.actualResult
    ? match.analyses.filter((analysis) => analysis.prediction !== match.actualResult)
    : [];
  const battleProfit = match.analyses.reduce((total, analysis) => total + (analysis.roiChange ?? 0), 0);

  return (
    <section className="container-shell py-12">
      <Link href="/battle" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> AI 배틀
      </Link>

      <div className="panel mb-8 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-accent-green">
              {match.league} · {match.sport} · <span className="hidden sm:inline">{formatDateTime(match.startTime)}</span>
              <span className="sm:hidden">{formatDateTime(match.startTime, "mobile")}</span>
            </p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-black text-white sm:text-4xl">
              <Swords className="text-accent-green" size={30} /> {match.match}
            </h1>
            <p className="mt-3 text-slate-400">{match.headline}</p>
          </div>
          <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} size="lg" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {match.analyses.map((analysis) => {
          const profile = aiCompetitors.find((ai) => ai.name === analysis.aiName);
          return (
            <article key={analysis.aiName} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-black text-white">{analysis.aiName}</p>
                  <p className="mt-1 text-sm font-bold text-accent-green">{profile?.analysisStyle}</p>
                </div>
                <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
                  신뢰도 {profile?.reliabilityGrade ?? "-"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-400">{profile?.investmentPhilosophy}</p>

              <div className="mt-5 grid gap-3">
                <BattleMetric label="예상 결과" value={analysis.prediction} highlight />
                <BattleMetric label="신뢰도" value={`${analysis.confidence}%`} />
                <BattleMetric label="선택 상태" value={analysis.decisionStatus} />
              </div>

              <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold text-accent-green">핵심 분석</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{analysis.summary}</p>
              </div>
              <div className="mt-4 rounded-md border border-accent-green/20 bg-accent-green/10 p-4">
                <p className="text-xs font-bold text-accent-green">선택 이유</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{analysis.decisionReason}</p>
              </div>
              <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold text-emerald-300">강점</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                  {analysis.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold text-red-300">리스크</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                  {analysis.risks.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {match.actualResult ? (
        <section className="panel mt-8 p-6 ring-1 ring-accent-green/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent-green">Battle Result</p>
              <h2 className="mt-2 text-2xl font-black text-white">배틀 결과와 수익 반영</h2>
            </div>
            <p className={battleProfit >= 0 ? "text-2xl font-black text-emerald-300" : "text-2xl font-black text-red-300"}>
              총 {formatSignedCurrency(battleProfit)}
            </p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            <ResultBlock label="실제 결과" value={match.actualResult} />
            <ResultBlock label="승리 AI" value={winners.map((winner) => winner.aiName).join(", ") || "-"} positive emphasis />
            <ResultBlock label="패배 AI" value={losers.map((loser) => loser.aiName).join(", ") || "-"} negative />
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-500">AI별 수익 금액</p>
              <div className="mt-3 grid gap-2 text-sm">
                {match.analyses.map((analysis) => (
                  <div key={analysis.aiName} className="flex justify-between gap-3">
                    <span className="font-semibold text-white">{analysis.aiName}</span>
                    <span className={(analysis.roiChange ?? 0) >= 0 ? "font-bold text-emerald-300" : "font-bold text-red-300"}>
                      {formatSignedCurrency(analysis.roiChange ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function BattleMetric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={highlight ? "mt-1 text-lg font-black text-accent-green" : "mt-1 text-lg font-black text-white"}>{value}</p>
    </div>
  );
}

function ResultBlock({
  label,
  value,
  positive,
  negative,
  emphasis,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className={emphasis ? "rounded-lg border border-accent-green/30 bg-accent-green/10 p-4" : "rounded-lg border border-white/10 bg-black/20 p-4"}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={positive ? "mt-2 text-xl font-black text-emerald-300" : negative ? "mt-2 text-lg font-black text-red-300" : "mt-2 text-lg font-black text-white"}>
        {value}
      </p>
    </div>
  );
}
