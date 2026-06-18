"use client";

import { AiIdentity } from "@/components/ai/AiIdentity";
import { formatPercent } from "@/lib/format";
import type { AICompetitor } from "@/lib/types";

type AiProfileCardProps = {
  ai: AICompetitor;
};

export function AiProfileCard({ ai }: AiProfileCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-sm font-black text-blue-700">
          {ai.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <AiIdentity name={ai.name} nameClassName="text-xl" />
            <span className="shrink-0 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">AI {ai.reliabilityGrade}</span>
          </div>
          <p className="mt-1 text-sm font-bold text-blue-700">{ai.analysisStyle}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{ai.investmentPhilosophy}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ai.signatureTraits.map((trait) => (
          <span key={trait} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {trait}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric label="현재 시즌 ROI" value={formatPercent(ai.roi)} tone={ai.roi >= 0 ? "positive" : "negative"} />
        <Metric label="적중률" value={`${ai.accuracy.toFixed(1)}%`} />
        <Metric label="최근 30일 ROI" value={formatPercent(ai.recent30DayRoi)} tone={ai.recent30DayRoi >= 0 ? "positive" : "negative"} />
        <Metric label="최근 30일" value={`${ai.recent30DayWins}승 ${ai.recent30DayLosses}패`} />
      </div>

      <RecentForm ai={ai} />
    </article>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-600">{label}</p>
      <p className={tone === "negative" ? "mt-1 font-black text-red-600" : tone === "positive" ? "mt-1 font-black text-emerald-600" : "mt-1 font-black text-slate-900"}>{value}</p>
    </div>
  );
}

function RecentForm({ ai }: { ai: AICompetitor }) {
  const latestTrend = ai.recentRoiTrend.at(-1) ?? ai.recent30DayRoi;
  const previousTrend = ai.recentRoiTrend.at(-2) ?? latestTrend;
  const trendDiff = latestTrend - previousTrend;

  return (
    <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-slate-600">최근 10경기</p>
        <p className={trendDiff >= 0 ? "text-xs font-black text-emerald-600" : "text-xs font-black text-red-600"}>
          ROI 흐름 {trendDiff >= 0 ? "+" : ""}
          {trendDiff.toFixed(1)}%p
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {ai.recent10Results.map((result, index) => (
          <span
            key={`${ai.id}-recent10-${index}`}
            className={
              result === "won"
                ? "flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-xs font-black text-emerald-600"
                : result === "lost"
                  ? "flex h-7 w-7 items-center justify-center rounded-md bg-red-50 text-xs font-black text-red-600"
                  : "flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-xs font-black text-blue-600"
            }
          >
            {result === "won" ? "O" : result === "lost" ? "X" : "-"}
          </span>
        ))}
      </div>
    </div>
  );
}
