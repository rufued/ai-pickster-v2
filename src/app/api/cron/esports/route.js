import { NextResponse } from "next/server";

import { fetchOddsPapiEsportsGames, ODDSPAPI_LOOKAHEAD_HOURS } from "@/lib/oddspapi";
import { supabaseAdmin } from "@/lib/supabase";
import { isMajorEsportsLeague } from "@/lib/esports-leagues";
import { logCronRun } from "@/lib/cron-log";

export const dynamic = "force-dynamic";

async function upsertGames(games) {
  if (!games.length) return 0;
  let { error } = await supabaseAdmin.from("games").upsert(games, { onConflict: "id" });
  if (error?.message?.includes("schema cache")) {
    const legacyGames = games.map(({ home_spread_point, away_spread_point, home_spread_odds, away_spread_odds, total_point, over_odds, under_odds, ...game }) => {
      void home_spread_point; void away_spread_point; void home_spread_odds; void away_spread_odds;
      void total_point; void over_odds; void under_odds;
      return game;
    });
    ({ error } = await supabaseAdmin.from("games").upsert(legacyGames, { onConflict: "id" }));
  }
  if (error) throw error;
  return games.length;
}

async function cleanupMinorUpcomingGames() {
  const now = new Date().toISOString();
  const { data: games, error: gamesError } = await supabaseAdmin
    .from("games")
    .select("id,sport,sport_label")
    .like("sport", "esports_%")
    .eq("status", "upcoming")
    .gte("commence_time", now);
  if (gamesError) throw gamesError;

  const minorGames = (games ?? []).filter((game) => !isMajorEsportsLeague(game.sport, game.sport_label));
  const ids = minorGames.map((game) => game.id);
  if (!ids.length) return { found: 0, deleted: 0, retained_with_bets: 0, leagues: [] };

  const [{ data: picks, error: picksError }, { data: legs, error: legsError }] = await Promise.all([
    supabaseAdmin.from("picks").select("game_id").in("game_id", ids),
    supabaseAdmin.from("parlay_legs").select("game_id").in("game_id", ids),
  ]);
  if (picksError) throw picksError;
  if (legsError) throw legsError;
  const referenced = new Set([...(picks ?? []), ...(legs ?? [])].map((row) => row.game_id));
  const deleteIds = ids.filter((id) => !referenced.has(id));
  if (deleteIds.length) {
    const { error: deleteError } = await supabaseAdmin.from("games").delete().in("id", deleteIds);
    if (deleteError) throw deleteError;
  }
  return {
    found: ids.length,
    deleted: deleteIds.length,
    retained_with_bets: ids.length - deleteIds.length,
    leagues: [...new Set(minorGames.map((game) => game.sport_label))].sort(),
  };
}

export async function GET(request) {
  const startedAt = new Date();
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (new URL(request.url).searchParams.get("cleanup") === "1") {
    try {
      return NextResponse.json({ success: true, cleanup: await cleanupMinorUpcomingGames() });
    } catch (error) {
      return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
  }

  try {
    if (!supabaseAdmin) throw new Error("Supabase admin client is unavailable");
    const result = await fetchOddsPapiEsportsGames();
    const upserted = await upsertGames(result.games);
    const bySport = result.games.reduce((counts, game) => {
      counts[game.sport] = (counts[game.sport] ?? 0) + 1;
      return counts;
    }, {});
    await logCronRun("esports", "success", startedAt, { fetched: result.games.length, by_sport: bySport, api_requests: result.diagnostics.api_requests });
    return NextResponse.json({
      success: true,
      fetched: result.games.length,
      upserted,
      by_sport: bySport,
      lookahead_hours: ODDSPAPI_LOOKAHEAD_HOURS,
      diagnostics: result.diagnostics,
      started_at: startedAt.toISOString(),
      finished_at: new Date().toISOString(),
    });
  } catch (error) {
    await logCronRun("esports", "error", startedAt, { error: error instanceof Error ? error.message : "Unknown error" });
    console.error("OddsPapi esports cron failed", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        started_at: startedAt.toISOString(),
        finished_at: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
