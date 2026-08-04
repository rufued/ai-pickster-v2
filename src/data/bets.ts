import type { AiId } from "./ai";
import type { SportName } from "./games";

export type BetStatus = "scheduled" | "live" | "won" | "lost" | "void";
export type BetKind = "single" | "combo";
export type BetOddsOption = {
  type: "home" | "away" | "draw" | "over" | "under";
  odds: number;
  point?: number;
};
export type BetLeg = {
  gameId: string; sport: SportName; league: string; homeTeam: string; awayTeam: string;
  selection: string; selectedSide?: "home" | "draw" | "away" | "total" | "handicap";
  market: string; pickType?: string; odds: number; oddsOptions: BetOddsOption[];
  analysis?: string; pickId?: string;
  finalScore?: string; result: "pending" | "won" | "lost" | "void";
};
export type AiBet = {
  id: string; aiId: AiId; kind: BetKind; status: BetStatus; stake: number; totalOdds: number;
  potentialProfit: number; returnAmount: number; profit: number; bankrollAfter: number;
  registeredAt: string; startsAt: string; reason: string; legs: BetLeg[];
};
