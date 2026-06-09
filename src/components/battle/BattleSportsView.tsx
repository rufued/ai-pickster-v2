"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="min-w-0 space-y-6">
        <BattleRanking ais={ais} />

        <section>
          <div className="mb-4">
            <p className="text-sm font-bold text-blue-600">Match Battles</p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">경기별 AI 예측 대결</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {filteredMatches.map((match) => (
              <BattleCard key={match.id} match={match} />
            ))}
            {filteredMatches.length === 0 ? (
              <div className="panel p-5 text-sm font-medium text-slate-600 xl:col-span-2">현재 선택한 종목의 AI 배틀이 없습니다.</div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
