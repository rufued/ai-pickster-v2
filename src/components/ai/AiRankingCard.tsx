import clsx from "clsx";
import { AiIdentity } from "@/components/ai/AiIdentity";
import type { AICompetitor } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/format";

type AiRankingCardProps = {
  ai: AICompetitor;
  rank: number;
};

export function AiRankingCard({ ai, rank }: AiRankingCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-black text-accent-green">
            {ai.initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">#{rank} AI League</p>
            <AiIdentity name={ai.name} showBadge={false} nameClassName="text-lg text-white" />
          </div>
        </div>
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-bold",
            rank === 1 ? "bg-accent-green text-black" : "bg-white/10 text-slate-300",
          )}
        >
          {rank === 1 ? `LEADER · ${ai.reliabilityGrade}` : `신뢰도 ${ai.reliabilityGrade}`}
        </span>
      </div>

      <div className="mt-5 rounded-md border border-accent-green/20 bg-accent-green/10 p-3">
        <p className="text-xs font-semibold text-accent-green">{ai.analysisStyle}</p>
        <p className="mt-1 text-sm text-slate-200">{ai.investmentPhilosophy}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="현재 자산" value={formatCurrency(ai.currentBalance)} />
        <Stat label="ROI" value={formatPercent(ai.roi)} positive={ai.roi >= 0} />
        <Stat label="적중률" value={`${ai.accuracy.toFixed(1)}%`} />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="최근 30일 ROI" value={formatPercent(ai.recent30DayRoi)} positive={ai.recent30DayRoi >= 0} />
        <Stat label="신뢰도" value={ai.reliabilityGrade} positive={ai.reliabilityGrade === "A+" || ai.reliabilityGrade === "A"} />
        <Stat label="최고 적중" value={ai.bestHitCombination} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">최근 10픽 흐름</p>
          <p className="text-xs font-bold text-slate-400">
            {ai.recentRoiTrend.at(-2) !== undefined && ai.recentRoiTrend.at(-1) !== undefined
              ? `ROI ${ai.recentRoiTrend.at(-1)! - ai.recentRoiTrend.at(-2)! >= 0 ? "+" : ""}${(ai.recentRoiTrend.at(-1)! - ai.recentRoiTrend.at(-2)!).toFixed(1)}%p`
              : "ROI -"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {ai.recent10Results.map((result, index) => (
            <span
              key={`${ai.id}-${result}-${index}`}
              aria-label={result}
              className={clsx(
                "flex h-6 w-6 items-center justify-center rounded-md border text-[11px] font-black",
                result === "적중"
                  ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-300"
                  : "border-red-300/40 bg-red-400/15 text-red-300",
              )}
            >
              {result === "적중" ? "O" : "X"}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={clsx("mt-1 font-bold", positive === undefined ? "text-slate-100" : positive ? "text-emerald-300" : "text-red-300")}>
        {value}
      </p>
    </div>
  );
}
