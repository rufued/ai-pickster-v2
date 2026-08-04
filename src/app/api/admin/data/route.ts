import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getOddsPapiAccountUsage } from "@/lib/oddspapi";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function isMissingColumn(error: { code?: string; message?: string } | null) {
  return Boolean(error && (error.code === "42703" || /column .* does not exist/i.test(error.message ?? "")));
}

function isUpcomingAndFuture(game: Row | undefined) {
  if (!game) return false;
  return game.status === "upcoming" && new Date(String(game.commence_time)).getTime() > Date.now();
}

function teamsLabel(game: Row | undefined) {
  return game ? `${String(game.home_team)} vs ${String(game.away_team)}` : "경기 정보 없음";
}

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  const now = new Date().toISOString();
  const [games, gameCount, pickCount, parlayCount, runs, oddsPapi, humanPicksResult, humanParlaysResult] = await Promise.all([
    admin.from("games").select("id,sport,sport_label,home_team,away_team,commence_time,home_odds,away_odds,draw_odds,home_spread_point,away_spread_point,home_spread_odds,away_spread_odds,total_point,over_odds,under_odds").eq("status", "upcoming").gte("commence_time", now).order("commence_time").limit(100),
    admin.from("games").select("id", { count: "exact", head: true }),
    admin.from("picks").select("id", { count: "exact", head: true }),
    admin.from("parlays").select("id", { count: "exact", head: true }),
    admin.from("cron_runs").select("job_name,status,started_at,finished_at,details").order("started_at", { ascending: false }).limit(20),
    getOddsPapiAccountUsage().catch(() => null),
    admin.from("picks").select("id,game_id,pick_label,stake,odds_used,status,settled_at,is_correct,is_single_bet,created_at").eq("ai_model", "human").eq("is_single_bet", true).order("created_at", { ascending: false }).limit(50),
    admin.from("parlays").select("id,stake,total_odds,status,settled_at,created_at").eq("ai_model", "human").order("created_at", { ascending: false }).limit(50),
  ]);
  if (games.error) return NextResponse.json({ error: games.error.message }, { status: 500 });

  const recentRuns = runs.error ? [] : runs.data ?? [];
  const latestGamesRun = recentRuns.find((run) => run.job_name === "games");
  const oddsApiUsage = latestGamesRun?.details && typeof latestGamesRun.details === "object"
    ? (latestGamesRun.details as { quota?: unknown }).quota ?? null
    : null;

  // "status" on picks was added by the 20260804_admin_console_upgrades migration; fall back gracefully if it hasn't run yet.
  const cancelSchemaReady = !isMissingColumn(humanPicksResult.error ?? null);
  let singlePickRows: Row[] = (humanPicksResult.data ?? []) as Row[];
  if (!cancelSchemaReady) {
    const fallback = await admin.from("picks").select("id,game_id,pick_label,stake,odds_used,settled_at,is_correct,is_single_bet,created_at").eq("ai_model", "human").eq("is_single_bet", true).order("created_at", { ascending: false }).limit(50);
    singlePickRows = ((fallback.data ?? []) as Row[]).map((pick) => ({ ...pick, status: "active" }));
  }
  const parlayRows: Row[] = (humanParlaysResult.data ?? []) as Row[];
  const parlayIds = parlayRows.map((parlay) => String(parlay.id));

  const legsResult = parlayIds.length
    ? await admin.from("parlay_legs").select("parlay_id,game_id,leg_order").in("parlay_id", parlayIds).eq("ai_model", "human").order("leg_order", { ascending: true })
    : { data: [] as Row[], error: null };
  const legRows = (legsResult.data ?? []) as Row[];

  const gameIds = [...new Set([...singlePickRows.map((pick) => String(pick.game_id)), ...legRows.map((leg) => String(leg.game_id))])];
  const gamesInfoResult = gameIds.length
    ? await admin.from("games").select("id,home_team,away_team,commence_time,status,sport_label").in("id", gameIds)
    : { data: [] as Row[], error: null };
  const gameById = new Map(((gamesInfoResult.data ?? []) as Row[]).map((game) => [String(game.id), game]));

  let legPickRows: Row[] = [];
  if (gameIds.length) {
    let legPicksQuery = admin.from("picks").select("game_id,pick_label,odds_used,status").eq("ai_model", "human").eq("is_single_bet", false).in("game_id", gameIds);
    if (cancelSchemaReady) legPicksQuery = legPicksQuery.neq("status", "cancelled");
    const legPicksResult = await legPicksQuery;
    legPickRows = (legPicksResult.data ?? []) as Row[];
  }
  const legPickByGame = new Map(legPickRows.map((pick) => [String(pick.game_id), pick]));

  const singleBets = singlePickRows.map((pick) => {
    const game = gameById.get(String(pick.game_id));
    const cancelled = pick.status === "cancelled";
    const settled = Boolean(pick.settled_at);
    const uiStatus = cancelled ? "cancelled" : settled ? (pick.is_correct === true ? "won" : pick.is_correct === false ? "lost" : "void") : "pending";
    return {
      id: String(pick.id),
      kind: "single" as const,
      uiStatus,
      stake: Number(pick.stake),
      totalOdds: Number(pick.odds_used),
      createdAt: String(pick.created_at),
      cancellable: cancelSchemaReady && uiStatus === "pending" && isUpcomingAndFuture(game),
      legs: [{ gameId: String(pick.game_id), teams: teamsLabel(game), pickLabel: String(pick.pick_label ?? ""), commenceTime: game ? String(game.commence_time) : null }],
    };
  });

  const parlayBets = parlayRows.map((parlay) => {
    const legs = legRows.filter((leg) => String(leg.parlay_id) === String(parlay.id)).map((leg) => {
      const game = gameById.get(String(leg.game_id));
      const legPick = legPickByGame.get(String(leg.game_id));
      return { gameId: String(leg.game_id), teams: teamsLabel(game), pickLabel: legPick ? String(legPick.pick_label ?? "") : "", commenceTime: game ? String(game.commence_time) : null };
    });
    const allUpcoming = legs.length > 0 && legs.every((leg) => isUpcomingAndFuture(gameById.get(leg.gameId)));
    return {
      id: String(parlay.id),
      kind: "parlay" as const,
      uiStatus: String(parlay.status),
      stake: Number(parlay.stake),
      totalOdds: Number(parlay.total_odds),
      createdAt: String(parlay.created_at),
      cancellable: parlay.status === "pending" && allUpcoming,
      legs,
    };
  });

  const humanBets = [...singleBets, ...parlayBets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({
    games: games.data ?? [],
    counts: { games: gameCount.count ?? 0, picks: pickCount.count ?? 0, parlays: parlayCount.count ?? 0 },
    runs: recentRuns,
    providers: {
      oddsPapi,
      theOddsApi: {
        configured: Boolean(process.env.ODDS_API_KEY),
        usage: oddsApiUsage,
      },
    },
    humanBets,
    cancelSchemaReady,
    migrationRequired: Boolean(runs.error),
  });
}
