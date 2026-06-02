"use client";

import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import type { Combination } from "@/lib/types";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";
import { getAnalysisMatch } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";

type CombinationCardProps = {
  combination: Combination;
  compact?: boolean;
};

export function CombinationCard({ combination, compact = false }: CombinationCardProps) {
  return (
    <article className="panel p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-black text-white">{combination.aiName}</span>
            <span className="rounded-full border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 text-xs font-bold text-accent-green">
              {combination.style}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <Layers3 size={16} className="text-accent-blue" />
            이번 조합: {combination.selections.length}폴더
          </p>
        </div>
        <StatusBadge status={combination.status} />
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">AI 판단 조합</p>
        <div className="grid gap-3">
          {combination.selections.map((selection, index) => (
            <div key={`${combination.id}-${selection.match}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-white">{selection.prediction}</p>
                <ExpectedScoreNote aiName={combination.aiName} analysisId={selection.analysisId} />
                <p className="mt-1 text-xs text-slate-500">
                  {selection.league} · {selection.match}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-slate-300">
                  {selection.odds.toFixed(2)}
                </span>
                <Link
                  href={`/analysis/${selection.analysisId}`}
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs font-bold text-accent-green transition hover:bg-accent-green hover:text-black"
                >
                  분석 보기 <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <Metric label="오늘의 조합 배당" value={combination.totalOdds.toFixed(2)} highlight />
        <Metric label="투자금" value={formatCurrency(combination.stake)} />
        <Metric label="예상 수익" value={formatCurrency(combination.potentialReturn)} highlight />
      </div>

      {!compact && combination.status !== "대기중" ? (
        <div className="mt-4 flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm">
          <span className="text-slate-400">{combination.result}</span>
          <span className={combination.profit >= 0 ? "font-bold text-emerald-300" : "font-bold text-red-300"}>
            {formatSignedCurrency(combination.profit)}
          </span>
        </div>
      ) : null}
    </article>
  );
}

function ExpectedScoreNote({ aiName, analysisId }: { aiName: string; analysisId: string }) {
  const match = getAnalysisMatch(analysisId);
  const analysis = match?.analyses.find((item) => item.aiName === aiName);

  if (!analysis?.expectedScore) {
    return null;
  }

  return <p className="mt-1 text-xs font-semibold text-accent-green">예상 스코어 {analysis.expectedScore}</p>;
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={highlight ? "mt-1 font-black text-accent-green" : "mt-1 font-bold text-white"}>{value}</p>
    </div>
  );
}
