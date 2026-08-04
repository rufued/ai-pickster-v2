import { createClient } from "@supabase/supabase-js";
import { SPORTS as SPORT_CONFIGS } from "./odds-api.js";
import { fetchOddsPapiCompletedGames } from "./oddspapi.js";

const ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4";
const STARTING_BALANCE = 100000;

const SPORTS = SPORT_CONFIGS.filter(
  (sport) => sport.enabled && sport.sourceSupported !== false,
).map((sport) => sport.key);

let adminClient;

function isMissingParlayTable(error) {
  return error?.code === "42P01" || error?.code === "42501" || error?.code === "PGRST205" || error?.message?.includes("schema cache") || error?.message?.includes("permission denied");
}

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server environment variables are not configured");
  }

  adminClient ??= createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}

function requireOddsApiKey() {
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey) {
    throw new Error("ODDS_API_KEY is not configured");
  }

  return apiKey;
}

function getScore(event, teamName) {
  const value = event.scores?.find((score) => score.name === teamName)?.score;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function getResult(homeScore, awayScore) {
  if (homeScore > awayScore) return "home_win";
  if (awayScore > homeScore) return "away_win";
  return "draw";
}

export function settlePickOutcome(pick, game) {
  const market = pick.market_type ?? (pick.pick_type?.includes("spread") ? "spread" : ["over", "under"].includes(pick.pick_type) ? "total" : "moneyline");
  if (market === "moneyline") return pick.pick_type === game.result;

  const homeScore = Number(game.home_score);
  const awayScore = Number(game.away_score);
  const line = Number(pick.line_value);
  if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || !Number.isFinite(line)) {
    throw new Error(`Pick ${pick.id} is missing a final score or line_value`);
  }

  let margin;
  if (pick.pick_type === "home_spread") margin = homeScore + line - awayScore;
  else if (pick.pick_type === "away_spread") margin = awayScore + line - homeScore;
  else {
    const difference = homeScore + awayScore - line;
    margin = pick.pick_type === "over" ? difference : -difference;
  }
  if (margin === 0) return null;
  return margin > 0;
}

async function fetchCompletedScores(sport, apiKey) {
  const params = new URLSearchParams({ apiKey, daysFrom: "3" });
  const response = await fetch(
    `${ODDS_API_BASE_URL}/sports/${sport}/scores/?${params.toString()}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    console.warn(`Odds API scores are currently unavailable for: ${sport}`);
    return [];
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Odds API scores request failed for ${sport} (${response.status}): ${details}`,
    );
  }

  const events = await response.json();
  return events.filter((event) => event.completed === true && event.scores);
}

export async function updateGameResults() {
  const supabase = getAdminClient();
  let scoresFound = 0;
  let gamesUpdated = 0;
  const sources = {};

  try {
    const apiKey = requireOddsApiKey();
    let sourceScores = 0;
    let sourceUpdated = 0;
    for (const sport of SPORTS) {
      const events = await fetchCompletedScores(sport, apiKey);
      sourceScores += events.length;

      for (const event of events) {
        const homeScore = getScore(event, event.home_team);
        const awayScore = getScore(event, event.away_team);

        if (homeScore === null || awayScore === null) continue;

        const { data, error } = await supabase
          .from("games")
          .update({
            home_score: homeScore,
            away_score: awayScore,
            result: getResult(homeScore, awayScore),
            status: "finished",
          })
          .eq("id", event.id)
          .eq("status", "upcoming")
          .select("id");

        if (error) throw new Error(`Failed to update game ${event.id}: ${error.message}`);
        sourceUpdated += data?.length ?? 0;
      }
    }
    scoresFound += sourceScores;
    gamesUpdated += sourceUpdated;
    sources.the_odds_api = { status: "ok", sports_checked: SPORTS.length, scores_found: sourceScores, games_updated: sourceUpdated };
  } catch (error) {
    sources.the_odds_api = { status: "error", error: error instanceof Error ? error.message : String(error) };
  }

  try {
    if (!process.env.ODDSPAPI_API_KEY) throw new Error("ODDSPAPI_API_KEY is not configured");
    const now = new Date();
    const since = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const { data: pendingGames, error: pendingError } = await supabase
      .from("games")
      .select("id,sport")
      .like("sport", "esports_%")
      .eq("status", "upcoming")
      .like("id", "oddspapi:%")
      .gte("commence_time", since.toISOString())
      .lte("commence_time", now.toISOString());
    if (pendingError) throw new Error(`Failed to fetch pending OddsPapi games: ${pendingError.message}`);

    const completed = await fetchOddsPapiCompletedGames(pendingGames ?? []);
    let sourceUpdated = 0;
    for (const game of completed.games) {
      const { data, error } = await supabase
        .from("games")
        .update({
          home_score: game.home_score,
          away_score: game.away_score,
          result: getResult(game.home_score, game.away_score),
          status: "finished",
        })
        .eq("id", game.id)
        .eq("status", "upcoming")
        .select("id");
      if (error) throw new Error(`Failed to update game ${game.id}: ${error.message}`);
      sourceUpdated += data?.length ?? 0;
    }
    scoresFound += completed.games.length;
    gamesUpdated += sourceUpdated;
    sources.oddspapi = { status: "ok", pending_checked: pendingGames?.length ?? 0, scores_found: completed.games.length, games_updated: sourceUpdated, api_requests: completed.requests };
  } catch (error) {
    sources.oddspapi = { status: "error", error: error instanceof Error ? error.message : String(error) };
  }

  if (Object.values(sources).every((source) => source.status === "error")) {
    throw new Error("All score data sources failed");
  }

  return { sports_checked: SPORTS.length + 1, scores_found: scoresFound, games_updated: gamesUpdated, sources };
}

export async function settlePicks() {
  const supabase = getAdminClient();
  const { data: finishedGames, error: gamesError } = await supabase
    .from("games")
    .select("id,result,home_score,away_score")
    .eq("status", "finished")
    .not("result", "is", null);

  if (gamesError) {
    throw new Error(`Failed to fetch finished games: ${gamesError.message}`);
  }

  if (!finishedGames?.length) {
    return { finished_games: 0, picks_settled: 0, wins: 0, losses: 0 };
  }

  const gameById = new Map(finishedGames.map((game) => [game.id, game]));
  let { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("*")
    .in("game_id", finishedGames.map((game) => game.id))
    .is("settled_at", null)
    .neq("status", "cancelled");

  if (picksError?.code === "42703" || /column .* does not exist/i.test(picksError?.message ?? "")) {
    ({ data: picks, error: picksError } = await supabase
      .from("picks")
      .select("*")
      .in("game_id", finishedGames.map((game) => game.id))
      .is("settled_at", null));
  }

  if (picksError) {
    throw new Error(`Failed to fetch unsettled picks: ${picksError.message}`);
  }

  const settledAt = new Date().toISOString();
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  let comboOnlySettled = 0;
  let picksSettled = 0;

  for (const pick of picks ?? []) {
    const isCorrect = settlePickOutcome(pick, gameById.get(pick.game_id));
    const isSingleBet = pick.is_single_bet !== false;
    const stake = Number(pick.stake);
    const odds = Number(pick.odds_used);
    const pnl = !isSingleBet || isCorrect === null ? 0 : Math.round(isCorrect ? stake * (odds - 1) : -stake);

    if (
      pick.stake === null ||
      !Number.isFinite(stake) ||
      (isCorrect === true && (pick.odds_used === null || !Number.isFinite(odds)))
    ) {
      throw new Error(`Pick ${pick.id} has an invalid stake or odds_used`);
    }

    let updateQuery = supabase
      .from("picks")
      .update({ is_correct: isCorrect, pnl, settled_at: settledAt })
      .is("settled_at", null);
    updateQuery = pick.id != null
      ? updateQuery.eq("id", pick.id)
      : updateQuery.eq("game_id", pick.game_id).eq("ai_model", pick.ai_model);
    const { data, error } = await updateQuery.select("game_id");

    if (error) {
      throw new Error(`Failed to settle pick ${pick.id}: ${error.message}`);
    }

    if (data?.length) {
      picksSettled += 1;
      if (!isSingleBet) comboOnlySettled += 1;
      else if (isCorrect) wins += 1;
      else if (isCorrect === false) losses += 1;
      else pushes += 1;
    }
  }

  return {
    finished_games: finishedGames.length,
    picks_settled: picksSettled,
    wins,
    losses,
    pushes,
    combo_only_picks_settled: comboOnlySettled,
  };
}

export async function settleParlays() {
  const supabase = getAdminClient();
  const { data: parlays, error: parlaysError } = await supabase
    .from("parlays")
    .select("id,ai_model,stake,total_odds")
    .eq("status", "pending");

  if (parlaysError) {
    if (isMissingParlayTable(parlaysError)) return { pending_parlays: 0, parlays_settled: 0, wins: 0, losses: 0, schema_missing: true };
    throw new Error(`Failed to fetch pending parlays: ${parlaysError.message}`);
  }
  if (!parlays?.length) return { pending_parlays: 0, parlays_settled: 0, wins: 0, losses: 0 };

  const parlayIds = parlays.map((parlay) => parlay.id);
  const { data: legs, error: legsError } = await supabase
    .from("parlay_legs")
    .select("parlay_id,game_id,ai_model")
    .in("parlay_id", parlayIds);

  if (legsError) throw new Error(`Failed to fetch parlay legs: ${legsError.message}`);
  const gameIds = [...new Set((legs ?? []).map((leg) => leg.game_id))];
  const { data: picks, error: picksError } = gameIds.length
    ? await supabase.from("picks").select("game_id,ai_model,is_correct,settled_at,odds_used").in("game_id", gameIds)
    : { data: [], error: null };

  if (picksError) throw new Error(`Failed to fetch parlay picks: ${picksError.message}`);
  const pickByKey = new Map((picks ?? []).map((pick) => [`${pick.ai_model}:${pick.game_id}`, pick]));
  const settledAt = new Date().toISOString();
  let settled = 0;
  let wins = 0;
  let losses = 0;

  for (const parlay of parlays) {
    const parlayLegs = (legs ?? []).filter((leg) => leg.parlay_id === parlay.id);
    const legPicks = parlayLegs.map((leg) => pickByKey.get(`${leg.ai_model}:${leg.game_id}`));
    const hasLost = legPicks.some((pick) => pick?.settled_at && pick.is_correct === false);
    const allResolved = legPicks.length >= 2 && legPicks.every((pick) => pick?.settled_at);
    if (!hasLost && !allResolved) continue;

    const won = !hasLost && allResolved;
    const stake = Number(parlay.stake);
    const totalOdds = Number(parlay.total_odds);
    if (!Number.isFinite(stake) || !Number.isFinite(totalOdds)) {
      throw new Error(`Parlay ${parlay.id} has an invalid stake or total_odds`);
    }
    const effectiveOdds = won
      ? legPicks.reduce((product, pick) => product * (pick.is_correct === null ? 1 : Number(pick.odds_used)), 1)
      : totalOdds;
    const pnl = Math.round(won ? stake * (effectiveOdds - 1) : -stake);
    const { data, error } = await supabase
      .from("parlays")
      .update({ status: won ? "won" : "lost", pnl, settled_at: settledAt, total_odds: effectiveOdds })
      .eq("id", parlay.id)
      .eq("status", "pending")
      .select("id");

    if (error) throw new Error(`Failed to settle parlay ${parlay.id}: ${error.message}`);
    if (data?.length) {
      settled += 1;
      if (won) wins += 1;
      else losses += 1;
    }
  }

  return { pending_parlays: parlays.length, parlays_settled: settled, wins, losses };
}

export async function refreshAiAssets() {
  const supabase = getAdminClient();
  const { data: assets, error: assetsError } = await supabase
    .from("ai_assets")
    .select("ai_model");

  if (assetsError) {
    throw new Error(`Failed to fetch AI assets: ${assetsError.message}`);
  }

  let { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("ai_model,is_correct,pnl,is_single_bet")
    .not("settled_at", "is", null);

  if (picksError?.message?.includes("schema cache")) {
    ({ data: picks, error: picksError } = await supabase.from("picks").select("ai_model,is_correct,pnl").not("settled_at", "is", null));
  }

  if (picksError) {
    throw new Error(`Failed to fetch settled picks: ${picksError.message}`);
  }

  const { data: parlays, error: parlaysError } = await supabase
    .from("parlays")
    .select("ai_model,pnl")
    .not("settled_at", "is", null);

  if (parlaysError && !isMissingParlayTable(parlaysError)) {
    throw new Error(`Failed to fetch settled parlays: ${parlaysError.message}`);
  }

  const parlayPnl = new Map();
  for (const parlay of parlays ?? []) {
    parlayPnl.set(parlay.ai_model, (parlayPnl.get(parlay.ai_model) ?? 0) + (Number(parlay.pnl) || 0));
  }

  const totals = new Map();

  for (const pick of picks ?? []) {
    if (pick.is_single_bet === false) continue;
    const current = totals.get(pick.ai_model) ?? { total_picks: 0, wins: 0, losses: 0, pnl: 0 };
    current.total_picks += 1;
    current.wins += pick.is_correct === true ? 1 : 0;
    current.losses += pick.is_correct === false ? 1 : 0;
    current.pnl += Number(pick.pnl) || 0;
    totals.set(pick.ai_model, current);
  }

  const results = [];

  for (const asset of assets ?? []) {
    const total = totals.get(asset.ai_model) ?? { total_picks: 0, wins: 0, losses: 0, pnl: 0 };
    const values = {
      total_picks: total.total_picks,
      wins: total.wins,
      losses: total.losses,
      balance: STARTING_BALANCE + total.pnl + (parlayPnl.get(asset.ai_model) ?? 0),
      roi: ((total.pnl + (parlayPnl.get(asset.ai_model) ?? 0)) / STARTING_BALANCE) * 100,
    };
    const { error } = await supabase
      .from("ai_assets")
      .update(values)
      .eq("ai_model", asset.ai_model);

    if (error) {
      throw new Error(`Failed to refresh ${asset.ai_model} assets: ${error.message}`);
    }

    results.push({ ai_model: asset.ai_model, ...values });
  }

  return { ai_models_updated: results.length, assets: results };
}
