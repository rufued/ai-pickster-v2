"use client";

import { useMemo, useState } from "react";
import { AiProfileCard } from "@/components/ai/AiProfileCard";
import { BattleCard } from "@/components/battle/BattleCard";
import { BattleRanking } from "@/components/battle/BattleRanking";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { getSportFromParam } from "@/lib/sports";
import type { AICompetitor, AnalysisMatch } from "@/lib/types";

type BattleSportsViewProps = {
  ais: AICompetitor[];
  matches: AnalysisMatch[];
};

export function BattleSportsView({ ais, matches }: BattleSportsViewProps) {
  const [selectedSport, setSelectedSport] = useState("all");
  const sport = getSportFromParam(selectedSport);
  const filteredMatches = useMemo(() => (sport ? matches.filter((match) => match.sport === sport) : matches), [matches, sport]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <SportsSidebar activeSport={selectedSport} onSportChange={setSelectedSport} />
      <div>
        <div className="mb-8">
          <BattleRanking ais={ais} />
        </div>

        <div className="mb-8">
          <div className="mb-5">
            <p className="text-sm font-semibold text-accent-green">AI Profiles</p>
            <h2 className="mt-1 text-2xl font-black text-white">배틀 참가 AI 스타일</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            {ais.map((ai) => (
              <AiProfileCard key={ai.id} ai={ai} />
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {filteredMatches.map((match) => (
            <BattleCard key={match.id} match={match} />
          ))}
          {filteredMatches.length === 0 ? (
            <div className="panel p-5 text-sm text-slate-400 xl:col-span-2">현재 더미데이터에는 해당 종목 배틀이 없습니다.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

