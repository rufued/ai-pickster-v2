"use client";

import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";
import type { Combination, CombinationStatus } from "@/lib/types";

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
              {combination.legs.length}폴더 조합
            </span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <Layers3 size={16} className="text-blue-600" />
            {combination.date} · 총 배당 {combination.totalOdds.toFixed(2)}
          </p>
        </div>
        <StatusPill status={combination.status} result={combination.result} />
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500">조합 구성</p>
        <div className="grid gap-3">
          {combination.legs.map((leg, index) => (
            <div key={`${combination.id}-${leg.matchId}-${index}`} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">
                  {leg.market} · {leg.pick}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <LeagueBadge league={leg.league} />
                  <TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} compact />
                </div>
                {!compact ? <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-600">{leg.reasoning}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600">
                  {leg.odds.toFixed(2)}
                </span>
                <Link
                  href={`/analysis/${leg.matchId}`}
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
        <Metric label="배팅금" value={formatCurrency(combination.stake)} />
        <Metric label="예상 환급" value={formatCurrency(combination.potentialPayout)} highlight />
        <Metric label="수익" value={formatSignedCurrency(combination.profit)} highlight={combination.profit >= 0} />
      </div>

      {!compact ? (
        <Link
          href={`/history/combo/${combination.id}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-md border border-blue-200 px-3 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-600 hover:text-white"
        >
          조합 상세 보기 <ArrowUpRight size={14} />
        </Link>
      ) : null}
    </article>
  );
}

function StatusPill({ status, result }: { status: CombinationStatus; result: string }) {
  const className =
    status === "won"
      ? "bg-emerald-50 text-emerald-700"
      : status === "lost"
        ? "bg-rose-50 text-rose-700"
        : "bg-blue-50 text-blue-700";

  return <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-black ${className}`}>{result}</span>;
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={highlight ? "mt-1 font-black text-blue-700" : "mt-1 font-bold text-slate-900"}>{value}</p>
    </div>
  );
}
