import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { aiConfigs } from "@/lib/aiConfig";
import type { AiProfile } from "@/data/ai";
import type { AiRanking } from "@/data/rankings";
import type { AiBet, BetOddsOption, BetStatus } from "@/data/bets";
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

function sportKey(value: unknown): Game["sportKey"] {
  const sport = text(value);
  if (sport.startsWith("soccer_")) return "soccer";
  if (sport.startsWith("baseball_")) return "baseball";
  if (sport.startsWith("basketball_")) return "basketball";
  if (sport.startsWith("esports_")) return "esports";
  if (sport.startsWith("volleyball_")) return "volleyball";
  if (sport.startsWith("icehockey_")) return "hockey";
  if (sport.startsWith("americanfootball_")) return "american-football";
  return "other";
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

function pickAnalysis(value: unknown, model: string) {
  const analysis = text(value).trim();
  if (analysis) return analysis;
  return model === "human"
    ? "SHadmin이 별도 설명을 남기지 않았습니다."
    : "이 선택에 대한 개별 분석이 기록되지 않았습니다.";
}

function parlayReason(legs: AiBet["legs"], model: string) {
  const uniqueAnalyses = [...new Set(legs.map((leg) => leg.analysis?.trim()).filter(Boolean))];
  if (model === "human" && uniqueAnalyses.length === 1) return uniqueAnalyses[0] as string;
  const selections = legs.map((leg) => leg.selection).filter(Boolean).join(", ");
  if (!selections) return model === "human" ? "SHadmin이 별도 설명을 남기지 않았습니다." : "조합 선택 근거가 기록되지 않았습니다.";
  return `${selections} 선택을 하나의 조합으로 구성했습니다. 각 경기의 선택 근거와 시장별 판단은 아래 경기별 분석에서 확인할 수 있습니다.`;
}

function configFor(model: string) {
  return aiConfigs.find((ai) => ai.id === model || ai.name.toLowerCase() === model.toLowerCase());
}

function oddsOptions(game: Row | undefined, pick: Row): BetOddsOption[] {
  if (!game) return [];
  const market = text(pick.market_type, "moneyline");
  const option = (type: BetOddsOption["type"], odds: unknown, point?: unknown): BetOddsOption | undefined => {
    if (odds == null || !Number.isFinite(Number(odds))) return undefined;
    return { type, odds: number(odds), ...(point == null ? {} : { point: number(point) }) };
  };
  const options = market === "total"
    ? [option("over", game.over_odds, game.total_point), option("under", game.under_odds, game.total_point)]
    : market === "spread"
      ? [option("home", game.home_spread_odds, game.home_spread_point), option("away", game.away_spread_odds, game.away_spread_point)]
      : [option("home", game.home_odds), option("draw", game.draw_odds), option("away", game.away_odds)];
  return options.filter((item): item is BetOddsOption => Boolean(item));
}

export type LiveData = {
  ais: AiProfile[];
  rankings: AiRanking[];
  games: Game[];
  bets: AiBet[];
  oddsMovements: OddsMovement[];
};

export type OddsMovement = {
  id: string;
  gameId: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  marketType: "moneyline" | "spread" | "total";
  selection: "home" | "away" | "draw" | "over" | "under";
  lineValue?: number;
  oldOdds: number;
  newOdds: number;
  changedAt: string;
};

export async function getLiveData(): Promise<LiveData> {
  noStore();
  const supabase = getSupabase();
  const [assetsResult, gamesResult, picksResult, parlaysResult, parlayLegsResult, movementsResult] = await Promise.all([
    supabase.from("ai_assets").select("*").order("balance", { ascending: false }),
    supabase.from("games").select("*").order("commence_time", { ascending: true }),
    supabase.from("picks").select("*").order("created_at", { ascending: false }),
    supabase.from("parlays").select("*").order("created_at", { ascending: false }),
    supabase.from("parlay_legs").select("*").order("leg_order", { ascending: true }),
    supabase.from("odds_movements").select("*").order("changed_at", { ascending: false }).limit(40),
  ]);

  if (assetsResult.error) throw new Error(`Failed to fetch ai_assets: ${assetsResult.error.message}`);
  if (gamesResult.error) throw new Error(`Failed to fetch games: ${gamesResult.error.message}`);
  if (picksResult.error) throw new Error(`Failed to fetch picks: ${picksResult.error.message}`);
  if (parlaysResult.error && !isMissingParlayTable(parlaysResult.error)) throw new Error(`Failed to fetch parlays: ${parlaysResult.error.message}`);
  if (parlayLegsResult.error && !isMissingParlayTable(parlayLegsResult.error)) throw new Error(`Failed to fetch parlay legs: ${parlayLegsResult.error.message}`);
  const movementsTableMissing = movementsResult.error && (movementsResult.error.code === "42P01" || /odds_movements|schema cache|does not exist/i.test(movementsResult.error.message));
  if (movementsResult.error && !movementsTableMissing) throw new Error(`Failed to fetch odds movements: ${movementsResult.error.message}`);

  const assets = (assetsResult.data ?? []) as Row[];
  const gameRows = (gamesResult.data ?? []) as Row[];
  const pickRows = ((picksResult.data ?? []) as Row[]).filter((pick) => pick.status !== "cancelled");
  const parlayRows = ((parlaysResult.data ?? []) as Row[]).filter((parlay) => parlay.status !== "cancelled");
  const parlayLegRows = (parlayLegsResult.data ?? []) as Row[];
  const movementRows = (movementsResult.data ?? []) as Row[];
  const gameById = new Map(gameRows.map((game) => [text(game.id), game]));
  const movementGameIds = new Set<string>();
  const oddsMovements: OddsMovement[] = [];
  for (const movement of movementRows) {
    const gameId = text(movement.game_id);
    const game = gameById.get(gameId);
    if (!game || movementGameIds.has(gameId) || game.status !== "upcoming" || new Date(text(game.commence_time)).getTime() < Date.now()) continue;
    const marketType = text(movement.market_type);
    const selection = text(movement.selection);
    if (!["moneyline", "spread", "total"].includes(marketType) || !["home", "away", "draw", "over", "under"].includes(selection)) continue;
    movementGameIds.add(gameId);
    oddsMovements.push({
      id: idText(movement.id, `${gameId}:${text(movement.changed_at)}`),
      gameId,
      league: text(game.sport_label),
      homeTeam: text(game.home_team),
      awayTeam: text(game.away_team),
      marketType: marketType as OddsMovement["marketType"],
      selection: selection as OddsMovement["selection"],
      ...(movement.line_value == null ? {} : { lineValue: number(movement.line_value) }),
      oldOdds: number(movement.old_odds),
      newOdds: number(movement.new_odds),
      changedAt: text(movement.changed_at),
    });
    if (oddsMovements.length === 8) break;
  }
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
      name: model === "human" ? "SHadmin" : text(asset.display_name, config?.name ?? model),
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
      settledBets,
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
      sportKey: sportKey(game.sport),
      sportCode: text(game.sport),
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
      reason: pickAnalysis(pick.analysis, text(pick.ai_model)),
      legs: [{
        gameId: text(pick.game_id),
        sport: sportGroup(game?.sport),
        league: text(game?.sport_label, text(game?.sport)),
        homeTeam: text(game?.home_team),
        awayTeam: text(game?.away_team),
        selection: text(pick.pick_label),
        selectedSide: selectedSide(pick.pick_type),
        market: marketLabel(pick.market_type),
        pickType: text(pick.pick_type),
        odds,
        oddsOptions: oddsOptions(game, pick),
        analysis: pickAnalysis(pick.analysis, text(pick.ai_model)),
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
          pickType: text(pick?.pick_type),
          odds: number(pick?.odds_used),
          oddsOptions: oddsOptions(game, pick ?? {}),
          analysis: pickAnalysis(pick?.analysis, text(parlay.ai_model)),
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
      reason: parlayReason(legs, text(parlay.ai_model)),
      legs,
    };
  });

  const bets = [...singleBets, ...parlayBets].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

  return { ais, rankings, games, bets, oddsMovements };
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
