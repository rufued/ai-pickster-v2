"use client";

import { Dumbbell, Gamepad2 } from "lucide-react";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import type { FeaturedMatch } from "@/lib/types";

type FeaturedMatchesProps = {
  matches: FeaturedMatch[];
  contained?: boolean;
};

export function FeaturedMatches({ matches, contained = true }: FeaturedMatchesProps) {
  const content = (
    <>
      <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-accent-blue">오늘 주요 경기</p>
          <h2 className="mt-2 text-2xl font-black text-white">오늘 주요 경기</h2>
        </div>
        <Dumbbell className="hidden text-slate-600 sm:block" size={24} />
      </div>

      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {matches.map((match) => {
          const [homeTeam, awayTeam = ""] = match.match.split(" vs ");

          return (
            <article key={match.id} className="panel min-w-0 overflow-hidden p-5">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <LeagueBadge league={match.league} className="border-white/10 bg-white/5 text-slate-300" />
              </div>
              <h3 className="mt-4 min-h-12 break-words text-lg font-black leading-snug text-white">
                <TeamMatchup homeTeam={homeTeam} awayTeam={awayTeam} compact />
              </h3>
              <div className="mt-4 flex min-w-0 items-center gap-2 text-sm text-slate-400">
                <Gamepad2 size={16} className="text-accent-green" />
                <span className="hidden sm:inline"><LocalDateTime value={match.startTime} /> 시작</span>
                <span className="sm:hidden"><LocalDateTime value={match.startTime} mode="mobile" /> 시작</span>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );

  if (!contained) {
    return <section>{content}</section>;
  }

  return <section className="container-shell pb-12">{content}</section>;
}
