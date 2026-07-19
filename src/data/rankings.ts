import { aiProfiles, startingBankroll } from "./ai";
import { bets } from "./bets";

export type RoiPoint = {
  date: string;
  bankroll: number;
  roi: number;
  profit: number;
  betCount: number;
};

export type AiRanking = {
  aiId: string;
  rank: number;
  currentBankroll: number;
  totalProfit: number;
  roi: number;
  winRate: number;
  totalBets: number;
  streak: number;
  bestProfit: number;
  worstLoss: number;
  roiHistory: RoiPoint[];
};

const adjustments: Record<string, number> = {
  gpt: 2400,
  gemini: 6600,
  claude: 3100,
  deepseek: -1800,
  grok: -900,
};

export const rankings: AiRanking[] = aiProfiles
  .map((ai) => {
    const aiBets = bets.filter((bet) => bet.aiId === ai.id);
    const settled = aiBets.filter((bet) => bet.status === "won" || bet.status === "lost");
    const baseProfit = settled.reduce((sum, bet) => sum + bet.profit, 0) + adjustments[ai.id];
    const wins = settled.filter((bet) => bet.status === "won").length;
    const losses = settled.filter((bet) => bet.status === "lost").length;
    const totalBets = aiBets.length + 16;
    const currentBankroll = startingBankroll + baseProfit;
    const roi = (baseProfit / startingBankroll) * 100;

    return {
      aiId: ai.id,
      rank: 0,
      currentBankroll,
      totalProfit: baseProfit,
      roi,
      winRate: ((wins + 8) / Math.max(wins + losses + 12, 1)) * 100,
      totalBets,
      streak: ai.id === "gemini" ? 4 : ai.id === "gpt" ? 3 : ai.id === "claude" ? 2 : 0,
      bestProfit: Math.max(0, ...settled.map((bet) => bet.profit), 4200 + Math.abs(adjustments[ai.id] / 2)),
      worstLoss: Math.min(0, ...settled.map((bet) => bet.profit), ai.id === "deepseek" ? -4100 : -2200),
      roiHistory: buildRoiHistory(baseProfit, totalBets),
    };
  })
  .sort((a, b) => b.roi - a.roi)
  .map((ranking, index) => ({ ...ranking, rank: index + 1 }));

function buildRoiHistory(finalProfit: number, totalBets: number): RoiPoint[] {
  const dates = ["07.01", "07.04", "07.07", "07.10", "07.13", "07.16", "07.19"];
  return dates.map((date, index) => {
    const progress = (index + 1) / dates.length;
    const wave = Math.sin(index * 1.6) * 900;
    const profit = Math.round(finalProfit * progress + wave);
    return {
      date,
      profit,
      bankroll: startingBankroll + profit,
      roi: (profit / startingBankroll) * 100,
      betCount: Math.round(totalBets * progress),
    };
  });
}
