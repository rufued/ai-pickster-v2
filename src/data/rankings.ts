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
