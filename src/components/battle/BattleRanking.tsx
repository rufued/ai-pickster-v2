"use client";

import { AiIdentity } from "@/components/ai/AiIdentity";
import type { AICompetitor } from "@/lib/types";

type BattleRankingProps = {
  ais: AICompetitor[];
};

export function BattleRanking({ ais }: BattleRankingProps) {
  const ranked = [...ais].sort((a, b) => getBattleWinRate(b) - getBattleWinRate(a));

  return (
    <div className="panel p-5">
      <div className="mb-5">
        <p className="text-sm font-bold text-blue-600">AI Battle Ranking</p>
        <h2 className="mt-1 text-2xl font-extrabold text-slate-900">AI 배틀 승률 순위</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {ranked.map((ai, index) => (
          <div key={ai.id} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-blue-700">#{index + 1}</p>
              <p className="text-2xl font-extrabold text-slate-900">{getBattleWinRate(ai)}%</p>
            </div>
            <AiIdentity name={ai.name} className="mt-3" nameClassName="text-xl" />
            <p className="mt-2 text-sm font-medium text-slate-600">
              {ai.battleWins}승 {ai.battleLosses}패
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getBattleWinRate(ai: AICompetitor) {
  return Math.round((ai.battleWins / (ai.battleWins + ai.battleLosses)) * 100);
}
