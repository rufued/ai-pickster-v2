import type { AICompetitor } from "@/lib/types";
import { formatPercent } from "@/lib/format";

type AiProfileCardProps = {
  ai: AICompetitor;
};

export function AiProfileCard({ ai }: AiProfileCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-black text-accent-green">
          {ai.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-black text-white">{ai.name}</h3>
            <span className="rounded-md border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 text-xs font-black text-accent-green">
              신뢰도 {ai.reliabilityGrade}
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-accent-green">{ai.analysisStyle}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{ai.investmentPhilosophy}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ai.signatureTraits.map((trait) => (
          <span key={trait} className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-xs font-semibold text-slate-300">
            {trait}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">현재 시즌 ROI</p>
          <p className={ai.roi >= 0 ? "mt-1 font-black text-emerald-300" : "mt-1 font-black text-red-300"}>{formatPercent(ai.roi)}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">적중률</p>
          <p className="mt-1 font-black text-white">{ai.accuracy.toFixed(1)}%</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">최근 30일 ROI</p>
          <p className="mt-1 font-black text-emerald-300">{formatPercent(ai.recent30DayRoi)}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-black/20 p-3">
          <p className="text-xs text-slate-500">최근 30일</p>
          <p className="mt-1 font-black text-white">
            {ai.recent30DayWins}승 {ai.recent30DayLosses}패
          </p>
        </div>
      </div>

      <RecentForm ai={ai} />
    </article>
  );
}

function RecentForm({ ai }: { ai: AICompetitor }) {
  const latestTrend = ai.recentRoiTrend.at(-1) ?? ai.recent30DayRoi;
  const previousTrend = ai.recentRoiTrend.at(-2) ?? latestTrend;
  const trendDiff = latestTrend - previousTrend;

  return (
    <div className="mt-5 rounded-md border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-slate-400">최근 10픽</p>
        <p className={trendDiff >= 0 ? "text-xs font-black text-emerald-300" : "text-xs font-black text-red-300"}>
          ROI 흐름 {trendDiff >= 0 ? "+" : ""}
          {trendDiff.toFixed(1)}%p
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ai.recent10Results.map((result, index) => (
          <span
            key={`${ai.id}-recent10-${index}`}
            className={
              result === "적중"
                ? "flex h-7 w-7 items-center justify-center rounded-md bg-emerald-400/15 text-xs font-black text-emerald-300"
                : "flex h-7 w-7 items-center justify-center rounded-md bg-red-400/15 text-xs font-black text-red-300"
            }
          >
            {result === "적중" ? "O" : "X"}
          </span>
        ))}
      </div>
    </div>
  );
}
