import type { AICompetitor } from "@/lib/types";

type BattleRankingProps = {
  ais: AICompetitor[];
};

export function BattleRanking({ ais }: BattleRankingProps) {
  const ranked = [...ais].sort((a, b) => getBattleWinRate(b) - getBattleWinRate(a));

  return (
    <div className="panel p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-accent-green">Battle Ranking</p>
        <h2 className="mt-1 text-2xl font-black text-white">배틀 승률 랭킹</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {ranked.map((ai, index) => (
          <div key={ai.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-accent-green">#{index + 1}</p>
              <p className="text-2xl font-black text-white">{getBattleWinRate(ai)}%</p>
            </div>
            <p className="mt-2 text-xl font-black text-white">{ai.name}</p>
            <p className="mt-1 text-xs font-bold text-accent-green">
              {ai.analysisStyle} · 신뢰도 {ai.reliabilityGrade}
            </p>
            <p className="mt-2 text-sm text-slate-400">
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
