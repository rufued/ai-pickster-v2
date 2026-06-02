"use client";

import { useMemo, useState } from "react";
import { CombinationFilterList } from "@/components/combinations/CombinationFilterList";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { getSportFromParam } from "@/lib/sports";
import type { Combination } from "@/lib/types";

type PredictionsSportsViewProps = {
  combinations: Combination[];
};

export function PredictionsSportsView({ combinations }: PredictionsSportsViewProps) {
  const [selectedSport, setSelectedSport] = useState("all");
  const sport = getSportFromParam(selectedSport);
  const filteredCombinations = useMemo(
    () => (sport ? combinations.filter((combination) => combination.selections.some((selection) => selection.sport === sport)) : combinations),
    [combinations, sport],
  );

  return (
    <div className="grid min-w-0 gap-6 overflow-hidden lg:grid-cols-[220px_1fr] lg:overflow-visible">
      <SportsSidebar activeSport={selectedSport} onSportChange={setSelectedSport} />
      <div className="min-w-0">
        <CombinationFilterList combinations={filteredCombinations} />
      </div>
    </div>
  );
}
