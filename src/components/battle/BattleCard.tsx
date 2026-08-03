"use client";

import clsx from "clsx";
import { Swords } from "lucide-react";
import Link from "next/link";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { getBattleAnalyses } from "@/lib/battleAnalyses";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import type { AnalysisMatch } from "@/lib/types";

type BattleCardProps = {
  match: AnalysisMatch;
  featured?: boolean;
};

export function BattleCard({ match, featured = false }: BattleCardProps) {
  const analyses = getBattleAnalyses(match.analyses);
  const homeTeam = match.homeTeam ?? match.match.split(" vs ")[0];
  const awayTeam = match.awayTeam ?? match.match.split(" vs ")[1] ?? "";

  return (
    <article className={clsx("panel min-w-0 overflow-hidden p-5", featured && "border-blue-300")}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
            <LeagueBadge league={match.league} />
            <span>{match.sport}</span>
            <span className="hidden sm:inline"><LocalDateTime value={match.startTime} /></span>
            <span className="sm:hidden"><LocalDateTime value={match.startTime} mode="mobile" /></span>
          </div>
          <h3 className="mt-3 break-words text-2xl font-extrabold text-slate-900">
            <TeamMatchup homeTeam={homeTeam} awayTeam={awayTeam} />
          </h3>
        </div>
        <Swords className="shrink-0 text-blue-600" size={24} />
      </div>

      <div className="mt-5 grid gap-3">
        {analyses.map((analysis) => (
          <div key={analysis.aiName} className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <AiIdentity name={analysis.aiName} />
              <p className="mt-1 truncate text-xs font-medium text-slate-600">{analysis.analysisAngle}</p>
            </div>
            <div className="min-w-0 text-right">
              <span className="block truncate font-extrabold text-blue-700">{analysis.prediction}</span>
              <p className="mt-1 truncate text-xs font-medium text-slate-600">신뢰도 {analysis.confidence}%</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Link href={`/battle/${match.id}`} className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
          배틀 보기
        </Link>
      </div>
    </article>
  );
}
