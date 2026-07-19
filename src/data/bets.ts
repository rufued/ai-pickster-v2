import type { AiId } from "./ai";
import type { SportName } from "./games";

export type BetStatus = "scheduled" | "live" | "won" | "lost" | "void";
export type BetKind = "single" | "combo";

export type BetLeg = {
  gameId: string;
  sport: SportName;
  league: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  selectedSide?: "home" | "draw" | "away" | "total" | "handicap";
  market: string;
  odds: number;
  finalScore?: string;
  result: "pending" | "won" | "lost" | "void";
};

export type AiBet = {
  id: string;
  aiId: AiId;
  kind: BetKind;
  status: BetStatus;
  stake: number;
  totalOdds: number;
  potentialProfit: number;
  returnAmount: number;
  profit: number;
  bankrollAfter: number;
  registeredAt: string;
  startsAt: string;
  reason: string;
  legs: BetLeg[];
};

export const bets: AiBet[] = [
  {
    id: "gpt-lg-seoul-0720",
    aiId: "gpt",
    kind: "combo",
    status: "scheduled",
    stake: 4200,
    totalOdds: 3.18,
    potentialProfit: 9156,
    returnAmount: 0,
    profit: 0,
    bankrollAfter: 106700,
    registeredAt: "2026-07-20T09:05:00+09:00",
    startsAt: "2026-07-20T18:30:00+09:00",
    reason: "GPT combines LG's bullpen edge with a low-tempo K League game to control volatility.",
    legs: [
      { gameId: "lg-kia-0720", sport: "야구", league: "KBO", homeTeam: "LG Twins", awayTeam: "KIA Tigers", selection: "LG win", selectedSide: "home", market: "Moneyline", odds: 1.74, finalScore: "-", result: "pending" },
      { gameId: "seoul-jeonbuk-0720", sport: "축구", league: "K League 1", homeTeam: "FC Seoul", awayTeam: "Jeonbuk Hyundai", selection: "Under 2.5", selectedSide: "total", market: "Total", odds: 1.83, finalScore: "-", result: "pending" },
    ],
  },
  {
    id: "gemini-triple-0720",
    aiId: "gemini",
    kind: "combo",
    status: "scheduled",
    stake: 5000,
    totalOdds: 5.73,
    potentialProfit: 23650,
    returnAmount: 0,
    profit: 0,
    bankrollAfter: 110740,
    registeredAt: "2026-07-20T09:20:00+09:00",
    startsAt: "2026-07-20T18:30:00+09:00",
    reason: "Gemini accepts a wider combo because the prices remain balanced across baseball, basketball, and LCK.",
    legs: [
      { gameId: "lg-kia-0720", sport: "야구", league: "KBO", homeTeam: "LG Twins", awayTeam: "KIA Tigers", selection: "LG moneyline", selectedSide: "home", market: "Moneyline", odds: 1.74, finalScore: "-", result: "pending" },
      { gameId: "lakers-warriors-0721", sport: "농구", league: "NBA Summer", homeTeam: "LA Lakers", awayTeam: "Golden State Warriors", selection: "Warriors -1.5", selectedSide: "away", market: "Handicap", odds: 1.91, finalScore: "-", result: "pending" },
      { gameId: "t1-geng-0721", sport: "e스포츠", league: "LCK", homeTeam: "T1", awayTeam: "Gen.G", selection: "Over 2.5 maps", selectedSide: "total", market: "Total", odds: 1.72, finalScore: "-", result: "pending" },
    ],
  },
  {
    id: "claude-t1-0721",
    aiId: "claude",
    kind: "single",
    status: "scheduled",
    stake: 3600,
    totalOdds: 1.78,
    potentialProfit: 2808,
    returnAmount: 0,
    profit: 0,
    bankrollAfter: 105470,
    registeredAt: "2026-07-20T10:10:00+09:00",
    startsAt: "2026-07-21T20:00:00+09:00",
    reason: "Claude avoids the bigger spread and keeps exposure to the strongest evidence: Gen.G moneyline.",
    legs: [
      { gameId: "t1-geng-0721", sport: "e스포츠", league: "LCK", homeTeam: "T1", awayTeam: "Gen.G", selection: "Gen.G moneyline", selectedSide: "away", market: "Moneyline", odds: 1.78, finalScore: "-", result: "pending" },
    ],
  },
  {
    id: "deepseek-padres-warriors-0720",
    aiId: "deepseek",
    kind: "combo",
    status: "live",
    stake: 3200,
    totalOdds: 3.86,
    potentialProfit: 9152,
    returnAmount: 0,
    profit: 0,
    bankrollAfter: 98100,
    registeredAt: "2026-07-20T08:35:00+09:00",
    startsAt: "2026-07-20T10:10:00+09:00",
    reason: "DeepSeek pairs a live underdog handicap with a pace-driven basketball total.",
    legs: [
      { gameId: "dodgers-padres-0720", sport: "야구", league: "MLB", homeTeam: "LA Dodgers", awayTeam: "San Diego Padres", selection: "Padres +1.5", selectedSide: "away", market: "Handicap", odds: 1.85, finalScore: "Live", result: "pending" },
      { gameId: "lakers-warriors-0721", sport: "농구", league: "NBA Summer", homeTeam: "LA Lakers", awayTeam: "Golden State Warriors", selection: "Over 218.5", selectedSide: "total", market: "Total", odds: 2.09, finalScore: "-", result: "pending" },
    ],
  },
  {
    id: "grok-t1-0721",
    aiId: "grok",
    kind: "single",
    status: "scheduled",
    stake: 2500,
    totalOdds: 2.05,
    potentialProfit: 2625,
    returnAmount: 0,
    profit: 0,
    bankrollAfter: 99100,
    registeredAt: "2026-07-20T10:45:00+09:00",
    startsAt: "2026-07-21T20:00:00+09:00",
    reason: "Grok chooses the less popular side because rivalry volatility is not fully reflected.",
    legs: [
      { gameId: "t1-geng-0721", sport: "e스포츠", league: "LCK", homeTeam: "T1", awayTeam: "Gen.G", selection: "T1 win", selectedSide: "home", market: "Moneyline", odds: 2.05, finalScore: "-", result: "pending" },
    ],
  },
  {
    id: "gemini-celtics-0718",
    aiId: "gemini",
    kind: "single",
    status: "won",
    stake: 4500,
    totalOdds: 1.92,
    potentialProfit: 4140,
    returnAmount: 8640,
    profit: 4140,
    bankrollAfter: 110740,
    registeredAt: "2026-07-18T08:00:00+09:00",
    startsAt: "2026-07-18T09:30:00+09:00",
    reason: "Bench minutes and rebounding profile supported the spread.",
    legs: [
      { gameId: "celtics-knicks-0718", sport: "농구", league: "NBA Summer", homeTeam: "Boston Celtics", awayTeam: "New York Knicks", selection: "Celtics -4.5", selectedSide: "home", market: "Handicap", odds: 1.92, finalScore: "111-103", result: "won" },
    ],
  },
  {
    id: "gpt-dodgers-0717",
    aiId: "gpt",
    kind: "single",
    status: "won",
    stake: 3800,
    totalOdds: 1.64,
    potentialProfit: 2432,
    returnAmount: 6232,
    profit: 2432,
    bankrollAfter: 106700,
    registeredAt: "2026-07-17T07:40:00+09:00",
    startsAt: "2026-07-17T10:10:00+09:00",
    reason: "Starting pitcher matchup created a clear favorite edge.",
    legs: [
      { gameId: "dodgers-padres-0717", sport: "야구", league: "MLB", homeTeam: "LA Dodgers", awayTeam: "San Diego Padres", selection: "Dodgers win", selectedSide: "home", market: "Moneyline", odds: 1.64, finalScore: "5-3", result: "won" },
    ],
  },
  {
    id: "deepseek-kia-0716",
    aiId: "deepseek",
    kind: "single",
    status: "lost",
    stake: 4100,
    totalOdds: 2.22,
    potentialProfit: 5002,
    returnAmount: 0,
    profit: -4100,
    bankrollAfter: 98100,
    registeredAt: "2026-07-16T13:15:00+09:00",
    startsAt: "2026-07-16T18:30:00+09:00",
    reason: "The value side missed after late bullpen pressure.",
    legs: [
      { gameId: "kia-lg-0716", sport: "야구", league: "KBO", homeTeam: "KIA Tigers", awayTeam: "LG Twins", selection: "KIA win", selectedSide: "home", market: "Moneyline", odds: 2.22, finalScore: "4-6", result: "lost" },
    ],
  },
  {
    id: "claude-seoul-under-0715",
    aiId: "claude",
    kind: "single",
    status: "won",
    stake: 3000,
    totalOdds: 1.79,
    potentialProfit: 2370,
    returnAmount: 5370,
    profit: 2370,
    bankrollAfter: 105470,
    registeredAt: "2026-07-15T14:20:00+09:00",
    startsAt: "2026-07-15T19:00:00+09:00",
    reason: "Low shot quality and conservative lineup news made the total attractive.",
    legs: [
      { gameId: "seoul-suwon-0715", sport: "축구", league: "K League 1", homeTeam: "FC Seoul", awayTeam: "Suwon FC", selection: "Under 2.5", selectedSide: "total", market: "Total", odds: 1.79, finalScore: "1-0", result: "won" },
    ],
  },
  {
    id: "grok-draw-0714",
    aiId: "grok",
    kind: "single",
    status: "lost",
    stake: 2200,
    totalOdds: 3.15,
    potentialProfit: 4730,
    returnAmount: 0,
    profit: -2200,
    bankrollAfter: 99100,
    registeredAt: "2026-07-14T12:10:00+09:00",
    startsAt: "2026-07-14T19:00:00+09:00",
    reason: "Contrarian draw path failed after an early goal changed the tempo.",
    legs: [
      { gameId: "jeonbuk-ulsan-0714", sport: "축구", league: "K League 1", homeTeam: "Jeonbuk Hyundai", awayTeam: "Ulsan HD", selection: "Draw", selectedSide: "draw", market: "1X2", odds: 3.15, finalScore: "1-3", result: "lost" },
    ],
  },
];
