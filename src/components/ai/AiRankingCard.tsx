import clsx from "clsx";
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
            <h3 className="truncate text-lg font-bold text-white">{ai.name}</h3>
          </div>
        </div>
        <span
          className={clsx(
            "rounded-full px-2.5 py-1 text-xs font-bold",
            rank === 1 ? "bg-accent-green text-black" : "bg-white/10 text-slate-300",
          )}
        >
          {rank === 1 ? "LEADER" : "CHASE"}
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
        <Stat label="판단 방식" value="3~5폴더 자율" />
        <Stat label="최고 적중" value={ai.bestHitCombination} />
        <Stat label="최고 배당" value={ai.bestHitOdds.toFixed(2)} positive />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">최근 조합 결과</p>
        <div className="flex items-center gap-2">
          {ai.recentResults.map((result, index) => (
            <span
              key={`${ai.id}-${result}-${index}`}
              aria-label={result}
              className={clsx(
                "h-3.5 w-3.5 rounded-full border",
                result === "적중"
                  ? "border-emerald-300 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                  : "border-red-300 bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.35)]",
              )}
            />
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
