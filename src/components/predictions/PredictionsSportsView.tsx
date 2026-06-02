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
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <SportsSidebar activeSport={selectedSport} onSportChange={setSelectedSport} />
      <CombinationFilterList combinations={filteredCombinations} />
    </div>
  );
}

