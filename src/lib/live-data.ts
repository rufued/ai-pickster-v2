import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { aiConfigs } from "@/lib/aiConfig";
import type { AiProfile } from "@/data/ai";
import type { AiRanking } from "@/data/rankings";
import type { AiBet, BetStatus } from "@/data/bets";
import type { Game, GameStatus, SportName } from "@/data/games";
import type { AICompetitor } from "@/lib/types";

const STARTING_BALANCE = 100000;

type Row = Record<string, unknown>;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server environment variables are not configured");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function number(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function gameStatus(value: unknown): GameStatus {
  if (value === "finished") return "final";
  if (value === "live") return "live";
  return "scheduled";
}

function sportGroup(value: unknown): SportName {
  const sport = text(value);
  if (sport.startsWith("soccer_")) return "축구";
  if (sport.startsWith("baseball_")) return "야구";
  if (sport.startsWith("basketball_")) return "농구";
  if (sport.startsWith("esports_")) return "E스포츠";
  if (sport.startsWith("volleyball_")) return "배구";
  if (sport.startsWith("icehockey_")) return "아이스하키";
  if (sport.startsWith("americanfootball_")) return "미식축구";
  return text(value) as SportName;
}

function pickStatus(pick: Row, game?: Row): BetStatus {
  if (pick.settled_at) return pick.is_correct === true ? "won" : "lost";
  if (game?.status === "live") return "live";
  return "scheduled";
}

function selectedSide(value: unknown) {
  if (value === "home_win") return "home" as const;
  if (value === "away_win") return "away" as const;
  if (value === "draw") return "draw" as const;
  return undefined;
}

function configFor(model: string) {
  return aiConfigs.find((ai) => ai.id === model || ai.name.toLowerCase() === model.toLowerCase());
}

export type LiveData = {
  ais: AiProfile[];
  rankings: AiRanking[];
  competitors: AICompetitor[];
  games: Game[];
  bets: AiBet[];
};

export async function getLiveData(): Promise<LiveData> {
  noStore();
  const supabase = getSupabase();
  const [assetsResult, gamesResult, picksResult] = await Promise.all([
    supabase.from("ai_assets").select("*").order("balance", { ascending: false }),
    supabase.from("games").select("*").order("commence_time", { ascending: true }),
    supabase.from("picks").select("*").order("created_at", { ascending: false }),
  ]);

  if (assetsResult.error) throw new Error(`Failed to fetch ai_assets: ${assetsResult.error.message}`);
  if (gamesResult.error) throw new Error(`Failed to fetch games: ${gamesResult.error.message}`);
  if (picksResult.error) throw new Error(`Failed to fetch picks: ${picksResult.error.message}`);

  const assets = (assetsResult.data ?? []) as Row[];
  const gameRows = (gamesResult.data ?? []) as Row[];
  const pickRows = (picksResult.data ?? []) as Row[];
  const gameById = new Map(gameRows.map((game) => [text(game.id), game]));
  const picksByGame = new Map<string, Row[]>();
  for (const pick of pickRows) {
    const gameId = text(pick.game_id);
    picksByGame.set(gameId, [...(picksByGame.get(gameId) ?? []), pick]);
  }

  const ais: AiProfile[] = assets.map((asset) => {
    const model = text(asset.ai_model);
    const config = configFor(model);
    return {
      id: model as AiProfile["id"],
      name: config?.name ?? model,
      provider: config?.provider ?? "AI",
      initials: (config?.name ?? model).slice(0, 2).toUpperCase(),
      color: config?.colorHex ?? "#64748B",
      style: "",
      description: "",
      total_picks: number(asset.total_picks),
    };
  });

  const rankings: AiRanking[] = assets.map((asset, index) => {
    const model = text(asset.ai_model);
    const modelPicks = pickRows.filter((pick) => text(pick.ai_model) === model);
    const settled = modelPicks.filter((pick) => Boolean(pick.settled_at));
    const pnlValues = settled.map((pick) => number(pick.pnl));
    const wins = settled.filter((pick) => pick.is_correct === true).length;
    const totalProfit = pnlValues.reduce((sum, pnl) => sum + pnl, 0);
    return {
      aiId: model,
      rank: index + 1,
      currentBankroll: number(asset.balance, STARTING_BALANCE),
      totalProfit,
      roi: number(asset.roi),
      winRate: settled.length ? (wins / settled.length) * 100 : 0,
      totalBets: number(asset.total_picks),
      streak: getCurrentStreak(settled),
      bestProfit: pnlValues.length ? Math.max(...pnlValues) : 0,
      worstLoss: pnlValues.length ? Math.min(...pnlValues) : 0,
      roiHistory: [],
    };
  });

  const games: Game[] = gameRows.map((game) => {
    const id = text(game.id);
    const gamePicks = picksByGame.get(id) ?? [];
    const homeScore = game.home_score;
    const awayScore = game.away_score;
    return {
      id,
      sport: sportGroup(game.sport),
      league: text(game.sport_label, text(game.sport)),
      homeTeam: text(game.home_team),
      awayTeam: text(game.away_team),
      startTime: text(game.commence_time),
      status: gameStatus(game.status),
      odds: {
        home: game.home_odds == null ? undefined : number(game.home_odds),
        away: game.away_odds == null ? undefined : number(game.away_odds),
        draw: game.draw_odds == null ? undefined : number(game.draw_odds),
      },
      selectedBy: gamePicks.map((pick) => text(pick.ai_model) as AiProfile["id"]),
      venue: "",
      result: text(game.result) || undefined,
      finalScore: homeScore == null || awayScore == null ? undefined : `${homeScore}-${awayScore}`,
      predictions: gamePicks.map((pick) => ({
        aiId: text(pick.ai_model) as AiProfile["id"],
        pick: text(pick.pick_label),
        confidence: number(pick.confidence),
        reason: text(pick.analysis),
      })),
    };
  });

  const bets: AiBet[] = pickRows.map((pick) => {
    const game = gameById.get(text(pick.game_id));
    const pickId = text(pick.id) || text(pick.pick_id) || `${text(pick.game_id)}-${text(pick.ai_model)}`;
    const stake = number(pick.stake);
    const odds = number(pick.odds_used);
    const profit = number(pick.pnl);
    const status = pickStatus(pick, game);
    return {
      id: pickId,
      aiId: text(pick.ai_model) as AiProfile["id"],
      kind: "single",
      status,
      stake,
      totalOdds: odds,
      potentialProfit: stake * Math.max(odds - 1, 0),
      returnAmount: status === "won" ? stake + profit : 0,
      profit,
      bankrollAfter: 0,
      registeredAt: text(pick.created_at),
      startsAt: text(game?.commence_time),
      reason: text(pick.analysis),
      legs: [{
        gameId: text(pick.game_id),
        sport: sportGroup(game?.sport),
        league: text(game?.sport_label, text(game?.sport)),
        homeTeam: text(game?.home_team),
        awayTeam: text(game?.away_team),
        selection: text(pick.pick_label),
        selectedSide: selectedSide(pick.pick_type),
        market: "Moneyline",
        odds,
        finalScore: game?.home_score == null || game?.away_score == null ? undefined : `${game.home_score}-${game.away_score}`,
        result: status === "won" ? "won" : status === "lost" ? "lost" : "pending",
      }],
    };
  });

  const competitors = rankings.map((ranking) => toCompetitor(ranking, ais.find((ai) => ai.id === ranking.aiId)));
  return { ais, rankings, competitors, games, bets };
}

function getCurrentStreak(settled: Row[]) {
  let streak = 0;
  for (const pick of settled) {
    if (pick.is_correct !== true) break;
    streak += 1;
  }
  return streak;
}

function toCompetitor(ranking: AiRanking, profile?: AiProfile): AICompetitor {
  const wins = Math.round((ranking.winRate / 100) * ranking.totalBets);
  const losses = Math.max(ranking.totalBets - wins, 0);
  return {
    id: ranking.aiId,
    name: profile?.name ?? ranking.aiId,
    initials: profile?.initials ?? ranking.aiId.slice(0, 2).toUpperCase(),
    reliabilityGrade: "C",
    startingBankroll: STARTING_BALANCE,
    currentBankroll: ranking.currentBankroll,
    startingBalance: STARTING_BALANCE,
    currentBalance: ranking.currentBankroll,
    roi: ranking.roi,
    winRate: ranking.winRate,
    accuracy: ranking.winRate,
    totalBets: ranking.totalBets,
    totalPicks: ranking.totalBets,
    totalProfit: ranking.totalProfit,
    bettingStyle: profile?.style ?? "",
    performanceHistory: [],
    recent30DayRoi: 0,
    recent30DayAccuracy: 0,
    recent30DayWins: 0,
    recent30DayLosses: 0,
    recent10Results: [],
    recentResults: [],
    recentRoiTrend: [],
    analysisStyle: profile?.style ?? "",
    investmentPhilosophy: "",
    signatureTraits: [],
    strategy: "",
    strategyDescription: "",
    bestHitCombination: "-",
    bestHitOdds: 0,
    wins,
    losses,
    battleWins: wins,
    battleLosses: losses,
    sportStats: [],
  };
}
