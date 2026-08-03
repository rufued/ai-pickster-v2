import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { aiConfigs } from "@/lib/aiConfig";
import type { AiProfile } from "@/data/ai";
import type { AiRanking } from "@/data/rankings";
import type { AiBet, BetStatus } from "@/data/bets";
import type { Game, GameStatus, SportName } from "@/data/games";

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

function idText(value: unknown, fallback = "") {
  return typeof value === "string" || typeof value === "number" || typeof value === "bigint" ? String(value) : fallback;
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
  if (pick.settled_at) return pick.is_correct === true ? "won" : pick.is_correct === false ? "lost" : "void";
  if (game?.status === "live") return "live";
  return "scheduled";
}

function selectedSide(value: unknown) {
  if (value === "home_win") return "home" as const;
  if (value === "away_win") return "away" as const;
  if (value === "draw") return "draw" as const;
  if (value === "home_spread") return "home" as const;
  if (value === "away_spread") return "away" as const;
  if (value === "over" || value === "under") return "total" as const;
  return undefined;
}

function marketLabel(value: unknown) {
  if (value === "spread") return "핸디캡";
  if (value === "total") return "언더오버";
  return "승무패";
}

function configFor(model: string) {
  return aiConfigs.find((ai) => ai.id === model || ai.name.toLowerCase() === model.toLowerCase());
}

export type LiveData = {
  ais: AiProfile[];
  rankings: AiRanking[];
  games: Game[];
  bets: AiBet[];
};

export async function getLiveData(): Promise<LiveData> {
  noStore();
  const supabase = getSupabase();
  const [assetsResult, gamesResult, picksResult, parlaysResult, parlayLegsResult] = await Promise.all([
    supabase.from("ai_assets").select("*").order("balance", { ascending: false }),
    supabase.from("games").select("*").order("commence_time", { ascending: true }),
    supabase.from("picks").select("*").order("created_at", { ascending: false }),
    supabase.from("parlays").select("*").order("created_at", { ascending: false }),
    supabase.from("parlay_legs").select("*").order("leg_order", { ascending: true }),
  ]);

  if (assetsResult.error) throw new Error(`Failed to fetch ai_assets: ${assetsResult.error.message}`);
  if (gamesResult.error) throw new Error(`Failed to fetch games: ${gamesResult.error.message}`);
  if (picksResult.error) throw new Error(`Failed to fetch picks: ${picksResult.error.message}`);
  if (parlaysResult.error && !isMissingParlayTable(parlaysResult.error)) throw new Error(`Failed to fetch parlays: ${parlaysResult.error.message}`);
  if (parlayLegsResult.error && !isMissingParlayTable(parlayLegsResult.error)) throw new Error(`Failed to fetch parlay legs: ${parlayLegsResult.error.message}`);

  const assets = (assetsResult.data ?? []) as Row[];
  const gameRows = (gamesResult.data ?? []) as Row[];
  const pickRows = (picksResult.data ?? []) as Row[];
  const parlayRows = (parlaysResult.data ?? []) as Row[];
  const parlayLegRows = (parlayLegsResult.data ?? []) as Row[];
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
    const modelPicks = pickRows.filter((pick) => text(pick.ai_model) === model && pick.is_single_bet !== false);
    const settled = modelPicks.filter((pick) => Boolean(pick.settled_at));
    const modelParlays = parlayRows.filter((parlay) => text(parlay.ai_model) === model);
    const settledParlays = modelParlays.filter((parlay) => Boolean(parlay.settled_at));
    const pnlValues = [...settled.map((pick) => number(pick.pnl)), ...settledParlays.map((parlay) => number(parlay.pnl))];
    const wins = settled.filter((pick) => pick.is_correct === true).length + settledParlays.filter((parlay) => parlay.status === "won").length;
    const settledBets = settled.length + settledParlays.length;
    const totalProfit = pnlValues.reduce((sum, pnl) => sum + pnl, 0);
    return {
      aiId: model,
      rank: index + 1,
      currentBankroll: number(asset.balance, STARTING_BALANCE),
      totalProfit,
      roi: number(asset.roi),
      winRate: settledBets ? (wins / settledBets) * 100 : 0,
      totalBets: modelPicks.length + modelParlays.length,
      streak: getCurrentStreak([...settled, ...settledParlays].sort((a, b) => new Date(text(b.settled_at)).getTime() - new Date(text(a.settled_at)).getTime())),
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
        handicap: game.home_spread_point == null || game.home_spread_odds == null ? undefined : `${number(game.home_spread_point) > 0 ? "+" : ""}${number(game.home_spread_point)} (${number(game.home_spread_odds).toFixed(2)})`,
        overUnder: game.total_point == null || game.over_odds == null || game.under_odds == null ? undefined : `${number(game.total_point)} · O ${number(game.over_odds).toFixed(2)} / U ${number(game.under_odds).toFixed(2)}`,
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

  const singleBets: AiBet[] = pickRows.filter((pick) => pick.is_single_bet !== false).map((pick) => {
    const game = gameById.get(text(pick.game_id));
    const pickId = idText(pick.id) || idText(pick.pick_id) || `${text(pick.game_id)}-${text(pick.ai_model)}`;
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
        market: marketLabel(pick.market_type),
        odds,
        finalScore: game?.home_score == null || game?.away_score == null ? undefined : `${game.home_score}-${game.away_score}`,
        result: status === "won" ? "won" : status === "lost" ? "lost" : status === "void" ? "void" : "pending",
      }],
    };
  });

  const pickByModelGame = new Map(pickRows.map((pick) => [`${text(pick.ai_model)}:${text(pick.game_id)}`, pick]));
  const parlayBets: AiBet[] = parlayRows.map((parlay) => {
    const parlayId = idText(parlay.id);
    const legs = parlayLegRows
      .filter((leg) => idText(leg.parlay_id) === parlayId)
      .sort((a, b) => number(a.leg_order) - number(b.leg_order))
      .map((leg) => {
        const pick = pickByModelGame.get(`${text(leg.ai_model)}:${text(leg.game_id)}`);
        const game = gameById.get(text(leg.game_id));
        return {
          gameId: text(leg.game_id),
          sport: sportGroup(game?.sport),
          league: text(game?.sport_label, text(game?.sport)),
          homeTeam: text(game?.home_team),
          awayTeam: text(game?.away_team),
          selection: text(pick?.pick_label),
          selectedSide: selectedSide(pick?.pick_type),
          market: marketLabel(pick?.market_type),
          odds: number(pick?.odds_used),
          finalScore: game?.home_score == null || game?.away_score == null ? undefined : `${game.home_score}-${game.away_score}`,
          result: pick?.settled_at ? (pick.is_correct === true ? "won" as const : pick.is_correct === false ? "lost" as const : "void" as const) : "pending" as const,
        };
      });
    const status: BetStatus = parlay.status === "won" ? "won" : parlay.status === "lost" ? "lost" : "scheduled";
    const stake = number(parlay.stake);
    const odds = number(parlay.total_odds);
    const profit = number(parlay.pnl);
    const startTimes = legs.map((leg) => gameById.get(leg.gameId)?.commence_time).filter(Boolean).map((value) => text(value));
    return {
      id: parlayId,
      aiId: text(parlay.ai_model) as AiProfile["id"],
      kind: "combo",
      status,
      stake,
      totalOdds: odds,
      potentialProfit: stake * Math.max(odds - 1, 0),
      returnAmount: status === "won" ? stake + profit : 0,
      profit,
      bankrollAfter: 0,
      registeredAt: text(parlay.created_at),
      startsAt: startTimes.sort()[0] ?? "",
      reason: "AI가 당일 고신뢰 픽을 조합한 폴더 베팅",
      legs,
    };
  });

  const bets = [...singleBets, ...parlayBets].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

  return { ais, rankings, games, bets };
}

export function getPendingPicks(bets: AiBet[]) {
  return bets
    .filter((bet) => bet.status === "scheduled" || bet.status === "live")
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

export function getSettledRecords(bets: AiBet[]) {
  return bets
    .filter((bet) => bet.status === "won" || bet.status === "lost" || bet.status === "void")
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
}

function isMissingParlayTable(error: { code?: string; message?: string }) {
  return error.code === "42P01" || error.code === "42501" || error.code === "PGRST205" || Boolean(error.message?.includes("schema cache")) || Boolean(error.message?.includes("permission denied"));
}

function getCurrentStreak(settled: Row[]) {
  let streak = 0;
  for (const pick of settled) {
    const won = pick.is_correct === true || pick.status === "won";
    if (!won) break;
    streak += 1;
  }
  return streak;
}
