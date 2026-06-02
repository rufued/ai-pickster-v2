import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { aiCompetitors, analysisMatches, getAnalysisMatch } from "@/lib/data";
import { formatPredictedTotal, formatTime } from "@/lib/format";

type AnalysisDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return analysisMatches.map((match) => ({ id: match.id }));
}

export default async function AnalysisDetailPage({ params }: AnalysisDetailPageProps) {
  const { id } = await params;
  const match = getAnalysisMatch(id);

  if (!match) {
    notFound();
  }

  return (
    <section className="container-shell py-12">
      <Link href="/analysis" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white">
        <ArrowLeft size={16} /> 분석 센터
      </Link>

      <div className="panel mb-8 p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-accent-green">
              {match.sport} · {match.league} · {formatTime(match.startTime)}
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{match.match}</h1>
            <p className="mt-3 text-slate-400">{match.headline}</p>
          </div>
          <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} size="lg" />
        </div>
      </div>

      <div className="mb-6 panel p-5">
        <p className="text-sm font-semibold text-slate-400">AI 예상 결과와 분석 관점 비교</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {match.analyses.map((analysis) => {
            const profile = aiCompetitors.find((ai) => ai.name === analysis.aiName);
            return (
              <div key={analysis.aiName} className="rounded-md border border-white/10 bg-black/20 p-4">
                <p className="font-black text-white">{analysis.aiName}</p>
                <p className="mt-1 text-xs font-bold text-accent-green">{profile?.analysisStyle}</p>
                <p className="mt-3 text-lg font-bold text-white">{analysis.prediction}</p>
                <p className="mt-1 text-sm text-slate-400">{analysis.analysisAngle}</p>
                <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-200">
                  {analysis.decisionStatus}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {match.analyses.map((analysis) => {
          const profile = aiCompetitors.find((ai) => ai.name === analysis.aiName);
          return (
            <article key={analysis.aiName} className="panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-black text-white">{analysis.aiName}</p>
                  <p className="mt-1 text-sm font-bold text-accent-green">{profile?.analysisStyle}</p>
                  <p className="mt-3 text-sm text-slate-400">예상 결과</p>
                  <p className="mt-1 text-lg font-bold text-white">{analysis.prediction}</p>
                </div>
                <span className="rounded-lg bg-white/10 px-3 py-2 text-right">
                  <span className="block text-xs font-semibold text-slate-500">신뢰도</span>
                  <span className="block text-lg font-black text-white">{analysis.confidence}%</span>
                </span>
              </div>

              <div className="mt-5 rounded-md border border-accent-green/20 bg-accent-green/10 p-3">
                <p className="text-xs font-bold text-accent-green">{analysis.analysisAngle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{analysis.summary}</p>
              </div>

              <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold text-accent-green">
                  {match.sport === "테니스" || match.sport === "e스포츠" ? "예상 세트 스코어" : "예상 스코어"}
                </p>
                <p className="mt-2 text-lg font-black text-white">{analysis.expectedScore}</p>
                {formatPredictedTotal(match.sport, analysis.predictedTotal) ? (
                  <p className="mt-2 text-sm font-semibold text-slate-300">
                    {match.sport === "테니스" || match.sport === "e스포츠" ? "예상 총 세트" : "예상 총 득점"}{" "}
                    <span className="text-accent-green">{formatPredictedTotal(match.sport, analysis.predictedTotal)}</span>
                  </p>
                ) : null}
              </div>

              <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold text-accent-green">선택 이유</p>
                <p className="mt-2 text-lg font-black text-white">{analysis.decisionStatus}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{analysis.decisionReason}</p>
              </div>

              <div className="mt-5 grid gap-3">
                <DetailBlock label="강점" items={analysis.strengths} tone="positive" />
                <DetailBlock label="리스크" items={analysis.risks} tone="negative" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function DetailBlock({ label, items, tone }: { label: string; items: string[]; tone: "positive" | "negative" }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className={tone === "positive" ? "text-xs font-bold text-emerald-300" : "text-xs font-bold text-red-300"}>{label}</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
