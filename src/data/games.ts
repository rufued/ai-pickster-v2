import type { AiId } from "./ai";

export type SportName = string;
export type GameStatus = "scheduled" | "live" | "final";
export type GameOdds = { home?: number; draw?: number; away?: number; handicap?: string; overUnder?: string };
export type GamePrediction = { aiId: AiId; pick: string; confidence: number; reason: string };
export type Game = {
  id: string;
  sport: SportName;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: GameStatus;
  odds: GameOdds;
  selectedBy: AiId[];
  venue: string;
  result?: string;
  finalScore?: string;
  predictions: GamePrediction[];
};
