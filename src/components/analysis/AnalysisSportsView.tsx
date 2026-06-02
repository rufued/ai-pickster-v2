"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { formatTime } from "@/lib/format";
import { getSportFromParam } from "@/lib/sports";
import type { AnalysisMatch } from "@/lib/types";

type AnalysisSportsViewProps = {
  matches: AnalysisMatch[];
};

export function AnalysisSportsView({ matches }: AnalysisSportsViewProps) {
  const [selectedSport, setSelectedSport] = useState("all");
  const sport = getSportFromParam(selectedSport);
  const filteredMatches = useMemo(() => (sport ? matches.filter((match) => match.sport === sport) : matches), [matches, sport]);

  return (
    <div className="grid min-w-0 gap-6 overflow-hidden lg:grid-cols-[220px_1fr] lg:overflow-visible">
      <SportsSidebar activeSport={selectedSport} onSportChange={setSelectedSport} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {filteredMatches.map((match) => (
          <article key={match.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>{match.sport}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>{match.league}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-600" />
                  <span>{formatTime(match.startTime)}</span>
                </div>
                <h2 className="mt-2 text-xl font-black text-white">{match.match}</h2>
                <p className="mt-2 text-sm text-slate-400">{match.headline}</p>
              </div>
              <BarChart3 className="shrink-0 text-accent-green" size={22} />
            </div>

            <div className="mt-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">AI 의견 일치도</p>
                <div className="mt-3 grid gap-2">
                  {match.analyses.map((analysis) => (
                    <div key={analysis.aiName} className="flex items-center gap-3 text-sm">
                      <span className="w-20 font-bold text-white">{analysis.aiName}</span>
                      <span className="font-semibold text-accent-green">{analysis.prediction}</span>
                      <span className="text-slate-500">{analysis.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <ConsensusBadge score={match.consensusScore} label={match.consensusLabel} size="lg" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">AI 분석 비교와 근거 확인</p>
              <Link
                href={`/analysis/${match.id}`}
                className="inline-flex items-center gap-1 rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-accent-green transition hover:bg-accent-green hover:text-black"
              >
                상세 보기 <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        ))}
        {filteredMatches.length === 0 ? (
          <div className="panel p-5 text-sm text-slate-400 xl:col-span-2">현재 더미데이터에는 해당 종목 분석이 없습니다.</div>
        ) : null}
      </div>
    </div>
  );
}
