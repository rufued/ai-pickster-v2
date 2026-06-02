"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type { Combination, AIStyle } from "@/lib/types";
import { CombinationCard } from "@/components/combinations/CombinationCard";

const filters: Array<"전체" | AIStyle> = ["전체", "데이터 안정형", "균형 분석형", "변동성 탐색형"];

type CombinationFilterListProps = {
  combinations: Combination[];
};

export function CombinationFilterList({ combinations }: CombinationFilterListProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");

  const filteredCombinations = useMemo(
    () => (activeFilter === "전체" ? combinations : combinations.filter((combination) => combination.style === activeFilter)),
    [activeFilter, combinations],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={clsx(
              "rounded-md border px-4 py-2 text-sm font-semibold transition",
              activeFilter === filter
                ? "border-accent-green bg-accent-green text-black"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {filteredCombinations.map((combination) => (
          <CombinationCard key={combination.id} combination={combination} />
        ))}
      </div>
      {filteredCombinations.length === 0 ? (
        <div className="panel p-5 text-sm text-slate-400">현재 선택한 조건에 맞는 AI 조합이 없습니다.</div>
      ) : null}
    </div>
  );
}
