"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { ConsensusBadge } from "@/components/analysis/ConsensusBadge";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getSportFromParam, normalizeSportCategoryId } from "@/lib/sports";
import type { AnalysisMatch } from "@/lib/types";

type AnalysisSportsViewProps = {
  matches: AnalysisMatch[];
  initialSport?: string;
};

export function AnalysisSportsView({ matches, initialSport = "all" }: AnalysisSportsViewProps) {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState(() => normalizeSportCategoryId(initialSport));
  const sport = getSportFromParam(selectedSport);
  const filteredMatches = useMemo(() => (sport ? matches.filter((match) => match.sport === sport) : matches), [matches, sport]);
  const handleSportChange = (sportId: string) => {
    const normalizedSportId = normalizeSportCategoryId(sportId);
    setSelectedSport(normalizedSportId);
    router.push(normalizedSportId === "all" ? "/analysis" : `/analysis?sport=${normalizedSportId}`, { scroll: false });
  };

  useEffect(() => {
    setSelectedSport(normalizeSportCategoryId(initialSport));
  }, [initialSport]);

  return (
    <div className="grid min-w-0 gap-6 overflow-hidden lg:grid-cols-[220px_1fr] lg:overflow-visible">
      <SportsSidebar basePath="/analysis" activeSport={selectedSport} onSportChange={handleSportChange} />
      <div className="grid min-w-0 gap-4 xl:grid-cols-2">
        {filteredMatches.map((match) => (
          <article key={match.id} className="panel p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                  <span>{match.sport}</span>
                  <LeagueBadge league={match.league} className="border-white/10 bg-white/5 text-slate-300" />
                  <span className="hidden sm:inline"><LocalDateTime value={match.startTime} /></span>
                  <span className="sm:hidden"><LocalDateTime value={match.startTime} mode="mobile" /></span>
                </div>
                <h2 className="mt-3 text-xl font-black text-white">
                  <TeamMatchup homeTeam={match.homeTeam ?? match.match.split(" vs ")[0]} awayTeam={match.awayTeam ?? match.match.split(" vs ")[1] ?? ""} />
                </h2>
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
                      <AiIdentity name={analysis.aiName} showBadge={false} nameClassName="text-sm text-white" />
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
