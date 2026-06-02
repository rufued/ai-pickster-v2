"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AiProfileCard } from "@/components/ai/AiProfileCard";
import { BattleCard } from "@/components/battle/BattleCard";
import { BattleRanking } from "@/components/battle/BattleRanking";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { getSportFromParam, normalizeSportCategoryId } from "@/lib/sports";
import type { AICompetitor, AnalysisMatch } from "@/lib/types";

type BattleSportsViewProps = {
  ais: AICompetitor[];
  matches: AnalysisMatch[];
  initialSport?: string;
};

export function BattleSportsView({ ais, matches, initialSport = "all" }: BattleSportsViewProps) {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState(() => normalizeSportCategoryId(initialSport));
  const sport = getSportFromParam(selectedSport);
  const filteredMatches = useMemo(() => (sport ? matches.filter((match) => match.sport === sport) : matches), [matches, sport]);
  const handleSportChange = (sportId: string) => {
    const normalizedSportId = normalizeSportCategoryId(sportId);
    setSelectedSport(normalizedSportId);
    router.push(normalizedSportId === "all" ? "/battle" : `/battle?sport=${normalizedSportId}`, { scroll: false });
  };

  useEffect(() => {
    setSelectedSport(normalizeSportCategoryId(initialSport));
  }, [initialSport]);

  return (
    <div className="grid min-w-0 gap-6 overflow-hidden lg:grid-cols-[220px_1fr] lg:overflow-visible">
      <SportsSidebar basePath="/battle" activeSport={selectedSport} onSportChange={handleSportChange} />
      <div className="min-w-0">
        <div className="mb-8">
          <BattleRanking ais={ais} />
        </div>

        <div className="mb-8">
          <div className="mb-5">
              <p className="text-sm font-semibold text-accent-green">AI 프로필</p>
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
