import type { AiId } from "./ai";

export type SportName = "축구" | "야구" | "농구" | "배구" | "하키" | "e스포츠";
export type GameStatus = "scheduled" | "live" | "final";

export type GameOdds = {
  home?: number;
  draw?: number;
  away?: number;
  handicap?: string;
  overUnder?: string;
};

export type GamePrediction = {
  aiId: AiId;
  pick: string;
  confidence: number;
  reason: string;
};

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

export const games: Game[] = [
  {
    id: "lg-kia-0720",
    sport: "야구",
    league: "KBO",
    homeTeam: "LG Twins",
    awayTeam: "KIA Tigers",
    startTime: "2026-07-20T18:30:00+09:00",
    status: "scheduled",
    venue: "Jamsil Baseball Stadium",
    odds: { home: 1.74, away: 2.08, handicap: "LG -1.5 2.16", overUnder: "8.5" },
    selectedBy: ["gpt", "gemini", "claude"],
    predictions: [
      { aiId: "gpt", pick: "LG win", confidence: 68, reason: "Bullpen stability and home run prevention favor LG." },
      { aiId: "gemini", pick: "LG moneyline", confidence: 64, reason: "The price is fair relative to recent starting pitcher form." },
      { aiId: "claude", pick: "Under 8.5", confidence: 61, reason: "Both teams project a slower run environment." },
    ],
  },
  {
    id: "dodgers-padres-0720",
    sport: "야구",
    league: "MLB",
    homeTeam: "LA Dodgers",
    awayTeam: "San Diego Padres",
    startTime: "2026-07-20T10:10:00+09:00",
    status: "live",
    venue: "Dodger Stadium",
    odds: { home: 1.61, away: 2.34, handicap: "Dodgers -1.5 2.02", overUnder: "7.5" },
    selectedBy: ["deepseek", "grok"],
    predictions: [
      { aiId: "deepseek", pick: "Padres +1.5", confidence: 57, reason: "The handicap price is more attractive than the market implies." },
      { aiId: "grok", pick: "Padres upset", confidence: 52, reason: "Public action is too concentrated on the Dodgers." },
    ],
  },
  {
    id: "seoul-jeonbuk-0720",
    sport: "축구",
    league: "K League 1",
    homeTeam: "FC Seoul",
    awayTeam: "Jeonbuk Hyundai",
    startTime: "2026-07-20T19:00:00+09:00",
    status: "scheduled",
    venue: "Seoul World Cup Stadium",
    odds: { home: 2.18, draw: 3.25, away: 3.05, handicap: "Seoul +0.25 1.83", overUnder: "2.5" },
    selectedBy: ["gpt", "claude"],
    predictions: [
      { aiId: "gpt", pick: "Under 2.5", confidence: 63, reason: "Both midfields reduce transition volume." },
      { aiId: "claude", pick: "Draw", confidence: 55, reason: "The strongest scenario cluster lands around 1-1." },
    ],
  },
  {
    id: "lakers-warriors-0721",
    sport: "농구",
    league: "NBA Summer",
    homeTeam: "LA Lakers",
    awayTeam: "Golden State Warriors",
    startTime: "2026-07-21T11:00:00+09:00",
    status: "scheduled",
    venue: "Crypto.com Arena",
    odds: { home: 1.92, away: 1.89, handicap: "Warriors -1.5 1.91", overUnder: "218.5" },
    selectedBy: ["gemini", "deepseek"],
    predictions: [
      { aiId: "gemini", pick: "Warriors -1.5", confidence: 60, reason: "Bench scoring depth creates a small spread edge." },
      { aiId: "deepseek", pick: "Over 218.5", confidence: 58, reason: "Pace and second-unit shot profile support a high total." },
    ],
  },
  {
    id: "t1-geng-0721",
    sport: "e스포츠",
    league: "LCK",
    homeTeam: "T1",
    awayTeam: "Gen.G",
    startTime: "2026-07-21T20:00:00+09:00",
    status: "scheduled",
    venue: "LoL Park",
    odds: { home: 2.05, away: 1.78, handicap: "Gen.G -1.5 2.42", overUnder: "2.5 maps" },
    selectedBy: ["grok", "claude", "gemini"],
    predictions: [
      { aiId: "grok", pick: "T1 win", confidence: 54, reason: "Draft volatility is underpriced in a rivalry match." },
      { aiId: "claude", pick: "Gen.G moneyline", confidence: 66, reason: "Objective control and lane stability favor Gen.G." },
      { aiId: "gemini", pick: "Over 2.5 maps", confidence: 62, reason: "Series profile points to a close three-map path." },
    ],
  },
];
