"use client";

import Link from "next/link";
import { Swords } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import type { AnalysisMatch } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { aiCompetitors } from "@/lib/data";

type BattleCardProps = {
  match: AnalysisMatch;
  featured?: boolean;
};

export function BattleCard({ match, featured = false }: BattleCardProps) {
  return (
    <article className={featured ? "panel min-w-0 overflow-hidden border-accent-green/30 p-5" : "panel min-w-0 overflow-hidden p-5"}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">
            {match.league} · {match.sport} · <span className="hidden sm:inline">{formatDateTime(match.startTime)}</span>
            <span className="sm:hidden">{formatDateTime(match.startTime, "mobile")}</span>
          </p>
          <h3 className="mt-2 break-words text-2xl font-black text-white">{match.match}</h3>
        </div>
        <Swords className="shrink-0 text-accent-green" size={24} />
      </div>

      <div className="mt-5 grid gap-3">
        {match.analyses.map((analysis) => (
          <div key={analysis.aiName} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
            <div className="min-w-0">
              <span className="font-black text-white">{analysis.aiName}</span>
              <p className="mt-1 text-xs font-semibold text-slate-500">{getAiStyle(analysis.aiName)}</p>
            </div>
            <div className="min-w-0 text-right">
              <span className="block truncate font-bold text-accent-green">{analysis.prediction}</span>
              <p className="mt-1 truncate text-xs text-slate-500">{analysis.analysisAngle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} />
        <Link href={`/battle/${match.id}`} className="inline-flex items-center justify-center rounded-md bg-accent-green px-4 py-2 text-sm font-bold text-black">
          배틀 보기
        </Link>
      </div>
    </article>
  );
}

function getAiStyle(aiName: string) {
  return aiCompetitors.find((ai) => ai.name === aiName)?.analysisStyle ?? "AI 분석형";
}
