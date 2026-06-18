import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Swords } from "lucide-react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { getBattleAnalyses } from "@/lib/battleAnalyses";
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

  const analyses = getBattleAnalyses(match.analyses);
  const winners = match.actualResult ? analyses.filter((analysis) => analysis.prediction === match.actualResult) : [];
  const losers = match.actualResult ? analyses.filter((analysis) => analysis.prediction !== match.actualResult) : [];
  const battleProfit = analyses.reduce((total, analysis) => total + (analysis.roiChange ?? 0), 0);

  return (
    <section className="container-shell py-8 sm:py-12">
      <Link href="/battle" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600">
        <ArrowLeft size={16} /> AI 배틀로 돌아가기
      </Link>

      <div className="panel mb-8 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-blue-600">
              <LeagueBadge league={match.league} />
              <span>{match.sport}</span>
              <span className="hidden sm:inline">{formatDateTime(match.startTime)}</span>
              <span className="sm:hidden">{formatDateTime(match.startTime, "mobile")}</span>
            </p>
            <h1 className="mt-3 flex min-w-0 items-center gap-3 break-words text-3xl font-black text-slate-900 sm:text-4xl">
              <Swords className="shrink-0 text-blue-600" size={30} />
              <TeamMatchup homeTeam={match.homeTeam ?? match.match.split(" vs ")[0]} awayTeam={match.awayTeam ?? match.match.split(" vs ")[1] ?? ""} />
            </h1>
            <p className="mt-3 text-slate-600">{match.headline}</p>
          </div>
          <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} size="lg" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {analyses.map((analysis) => {
          const profile = aiCompetitors.find((ai) => ai.name === analysis.aiName);

          return (
            <article key={analysis.aiName} className="panel p-5">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <AiIdentity name={analysis.aiName} nameClassName="text-2xl" />
                  <p className="mt-1 text-sm font-bold text-blue-700">{profile?.analysisStyle}</p>
                </div>
                <span className="shrink-0 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">AI {profile?.reliabilityGrade ?? "-"}</span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-700">{profile?.investmentPhilosophy}</p>

              <div className="mt-5 grid gap-3">
                <BattleMetric label="예상 결과" value={analysis.prediction} highlight />
                <BattleMetric label="신뢰도" value={`${analysis.confidence}%`} />
                <BattleMetric label="선택 상태" value={analysis.decisionStatus} />
              </div>

              <InfoBlock label="핵심 분석" value={analysis.summary} />
              <InfoBlock label="선택 이유" value={analysis.decisionReason} blue />
              <ListBlock label="강점" items={analysis.strengths} positive />
              <ListBlock label="리스크" items={analysis.risks} negative />
            </article>
          );
        })}
      </div>

      {match.actualResult ? (
        <section className="panel mt-8 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">Battle Result</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">배틀 결과와 수익 반영</h2>
            </div>
            <p className={battleProfit >= 0 ? "text-2xl font-black text-emerald-600" : "text-2xl font-black text-red-600"}>총 {formatSignedCurrency(battleProfit)}</p>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-4">
            <ResultBlock label="실제 결과" value={match.actualResult} />
            <ResultBlock label="승리 AI" value={<AiList analyses={winners} />} positive emphasis />
            <ResultBlock label="패배 AI" value={<AiList analyses={losers} />} negative />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-600">AI별 수익 금액</p>
              <div className="mt-3 grid gap-2 text-sm">
                {analyses.map((analysis) => (
                  <div key={analysis.aiName} className="flex min-w-0 items-center justify-between gap-3">
                    <AiIdentity name={analysis.aiName} showBadge={false} nameClassName="text-sm" />
                    <span className={(analysis.roiChange ?? 0) >= 0 ? "shrink-0 font-bold text-emerald-600" : "shrink-0 font-bold text-red-600"}>
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
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-600">{label}</p>
      <p className={highlight ? "mt-1 text-lg font-black text-blue-700" : "mt-1 text-lg font-black text-slate-900"}>{value}</p>
    </div>
  );
}

function InfoBlock({ label, value, blue }: { label: string; value: string; blue?: boolean }) {
  return (
    <div className={blue ? "mt-4 rounded-md border border-blue-100 bg-blue-50 p-4" : "mt-5 rounded-md border border-slate-200 bg-slate-50 p-4"}>
      <p className={blue ? "text-xs font-bold text-blue-700" : "text-xs font-bold text-slate-700"}>{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function ListBlock({ label, items, positive, negative }: { label: string; items: string[]; positive?: boolean; negative?: boolean }) {
  return (
    <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className={positive ? "text-xs font-bold text-emerald-600" : negative ? "text-xs font-bold text-red-600" : "text-xs font-bold text-slate-700"}>{label}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function AiList({ analyses }: { analyses: Array<{ aiName: string }> }) {
  if (analyses.length === 0) {
    return <span>-</span>;
  }

  return (
    <span className="inline-flex flex-wrap gap-2">
      {analyses.map((analysis) => (
        <AiIdentity key={analysis.aiName} name={analysis.aiName} showBadge={false} nameClassName="text-sm" />
      ))}
    </span>
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
  value: ReactNode;
  positive?: boolean;
  negative?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className={emphasis ? "rounded-lg border border-blue-200 bg-blue-50 p-4" : "rounded-lg border border-slate-200 bg-slate-50 p-4"}>
      <p className="text-xs text-slate-600">{label}</p>
      <div className={positive ? "mt-2 text-lg font-black text-emerald-600" : negative ? "mt-2 text-lg font-black text-red-600" : "mt-2 text-lg font-black text-slate-900"}>{value}</div>
    </div>
  );
}
