"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CombinationFilterList } from "@/components/combinations/CombinationFilterList";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { getSportFromParam, normalizeSportCategoryId } from "@/lib/sports";
import type { Combination } from "@/lib/types";

type PredictionsSportsViewProps = {
  combinations: Combination[];
  initialSport?: string;
};

export function PredictionsSportsView({ combinations, initialSport = "all" }: PredictionsSportsViewProps) {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState(() => normalizeSportCategoryId(initialSport));
  const sport = getSportFromParam(selectedSport);
  const filteredCombinations = useMemo(
    () => (sport ? combinations.filter((combination) => combination.selections.some((selection) => selection.sport === sport)) : combinations),
    [combinations, sport],
  );
  const handleSportChange = (sportId: string) => {
    const normalizedSportId = normalizeSportCategoryId(sportId);
    setSelectedSport(normalizedSportId);
    router.push(normalizedSportId === "all" ? "/predictions" : `/predictions?sport=${normalizedSportId}`, { scroll: false });
  };

  useEffect(() => {
    setSelectedSport(normalizeSportCategoryId(initialSport));
  }, [initialSport]);

  return (
    <div className="grid min-w-0 gap-6 overflow-hidden lg:grid-cols-[220px_1fr] lg:overflow-visible">
      <SportsSidebar basePath="/predictions" activeSport={selectedSport} onSportChange={handleSportChange} />
      <div className="min-w-0">
        <CombinationFilterList combinations={filteredCombinations} />
      </div>
    </div>
  );
}
