"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { CombinationCard } from "@/components/combinations/CombinationCard";
import type { Combination } from "@/lib/types";

const filters = ["전체", "GPT", "Gemini", "DeepSeek", "Grok", "Claude"] as const;

type CombinationFilterListProps = {
  combinations: Combination[];
};

export function CombinationFilterList({ combinations }: CombinationFilterListProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("전체");

  const filteredCombinations = useMemo(
    () => (activeFilter === "전체" ? combinations : combinations.filter((combination) => combination.aiName === activeFilter)),
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
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-bold transition",
              activeFilter === filter
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            {filter === "전체" ? filter : <AiIdentity name={filter} showBadge={false} nameClassName={activeFilter === filter ? "text-white" : "text-inherit"} />}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCombinations.map((combination) => (
          <CombinationCard key={combination.id} combination={combination} />
        ))}
      </div>

      {filteredCombinations.length === 0 ? <div className="panel p-5 text-sm text-slate-500">선택한 조건에 맞는 AI 배팅 조합이 없습니다.</div> : null}
    </div>
  );
}
