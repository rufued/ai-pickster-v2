"use client";

import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { getAnalysisMatch } from "@/lib/data";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";
import type { Combination } from "@/lib/types";

type CombinationCardProps = {
  combination: Combination;
  compact?: boolean;
};

export function CombinationCard({ combination, compact = false }: CombinationCardProps) {
  return (
    <article className="panel min-w-0 overflow-hidden p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <AiIdentity name={combination.aiName} nameClassName="text-xl" />
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
              AI Pickster
            </span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <Layers3 size={16} className="text-blue-600" />
            추천 조합: {combination.selections.length}경기
          </p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">{combination.status}</span>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">추천 픽</p>
        <div className="grid gap-3">
          {combination.selections.map((selection, index) => (
            <div key={`${combination.id}-${selection.match}-${index}`} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">{selection.prediction}</p>
                <ExpectedScoreNote aiName={combination.aiName} analysisId={selection.analysisId} />
                <p className="mt-1 truncate text-xs text-slate-500">
                  {selection.league} · {selection.match}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600">
                  {selection.odds.toFixed(2)}
                </span>
                <Link
                  href={`/analysis/${selection.analysisId}`}
                  className="inline-flex items-center gap-1 rounded-md border border-blue-200 px-2 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                >
                  분석 <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <Metric label="조합 지수" value={combination.totalOdds.toFixed(2)} highlight />
        <Metric label="가상 투입" value={formatCurrency(combination.stake)} />
        <Metric label="예상 SHC" value={formatCurrency(combination.potentialReturn)} highlight />
      </div>

      {!compact && combination.status !== "대기중" ? (
        <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <span className="text-slate-500">{combination.result}</span>
          <span className={combination.profit >= 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>
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

  return <p className="mt-1 text-xs font-semibold text-blue-700">예상 스코어 {analysis.expectedScore}</p>;
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={highlight ? "mt-1 font-black text-blue-700" : "mt-1 font-bold text-slate-900"}>{value}</p>
    </div>
  );
}
