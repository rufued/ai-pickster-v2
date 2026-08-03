import { createClient } from "@supabase/supabase-js";
import { SPORTS as SPORT_CONFIGS } from "./odds-api.js";

const ODDS_API_BASE_URL = "https://api.the-odds-api.com/v4";
const STARTING_BALANCE = 100000;

const SPORTS = SPORT_CONFIGS.filter((sport) => sport.enabled).map((sport) => sport.key);

let adminClient;

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
  const apiKey = requireOddsApiKey();
  let scoresFound = 0;
  let gamesUpdated = 0;

  for (const sport of SPORTS) {
    const events = await fetchCompletedScores(sport, apiKey);
    scoresFound += events.length;

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

      if (error) {
        throw new Error(`Failed to update game ${event.id}: ${error.message}`);
      }

      gamesUpdated += data?.length ?? 0;
    }
  }

  return { sports_checked: SPORTS.length, scores_found: scoresFound, games_updated: gamesUpdated };
}

export async function settlePicks() {
  const supabase = getAdminClient();
  const { data: finishedGames, error: gamesError } = await supabase
    .from("games")
    .select("id,result")
    .eq("status", "finished")
    .not("result", "is", null);

  if (gamesError) {
    throw new Error(`Failed to fetch finished games: ${gamesError.message}`);
  }

  if (!finishedGames?.length) {
    return { finished_games: 0, picks_settled: 0, wins: 0, losses: 0 };
  }

  const resultByGame = new Map(finishedGames.map((game) => [game.id, game.result]));
  const { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("id,game_id,pick_type,stake,odds_used")
    .in("game_id", finishedGames.map((game) => game.id))
    .is("settled_at", null);

  if (picksError) {
    throw new Error(`Failed to fetch unsettled picks: ${picksError.message}`);
  }

  const settledAt = new Date().toISOString();
  let wins = 0;
  let losses = 0;
  let picksSettled = 0;

  for (const pick of picks ?? []) {
    const isCorrect = pick.pick_type === resultByGame.get(pick.game_id);
    const stake = Number(pick.stake);
    const odds = Number(pick.odds_used);
    const pnl = isCorrect ? stake * (odds - 1) : -stake;

    if (
      pick.stake === null ||
      !Number.isFinite(stake) ||
      (isCorrect && (pick.odds_used === null || !Number.isFinite(odds)))
    ) {
      throw new Error(`Pick ${pick.id} has an invalid stake or odds_used`);
    }

    const { data, error } = await supabase
      .from("picks")
      .update({ is_correct: isCorrect, pnl, settled_at: settledAt })
      .eq("id", pick.id)
      .is("settled_at", null)
      .select("id");

    if (error) {
      throw new Error(`Failed to settle pick ${pick.id}: ${error.message}`);
    }

    if (data?.length) {
      picksSettled += 1;
      if (isCorrect) wins += 1;
      else losses += 1;
    }
  }

  return {
    finished_games: finishedGames.length,
    picks_settled: picksSettled,
    wins,
    losses,
  };
}

export async function refreshAiAssets() {
  const supabase = getAdminClient();
  const { data: assets, error: assetsError } = await supabase
    .from("ai_assets")
    .select("ai_model");

  if (assetsError) {
    throw new Error(`Failed to fetch AI assets: ${assetsError.message}`);
  }

  const { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("ai_model,is_correct,pnl")
    .not("settled_at", "is", null);

  if (picksError) {
    throw new Error(`Failed to fetch settled picks: ${picksError.message}`);
  }

  const totals = new Map();

  for (const pick of picks ?? []) {
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
      balance: STARTING_BALANCE + total.pnl,
      roi: (total.pnl / STARTING_BALANCE) * 100,
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
