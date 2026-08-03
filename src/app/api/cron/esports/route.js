import { NextResponse } from "next/server";

import { fetchOddsPapiEsportsGames, ODDSPAPI_LOOKAHEAD_HOURS } from "@/lib/oddspapi";
import { supabaseAdmin } from "@/lib/supabase";

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

export async function GET(request) {
  const startedAt = new Date();
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!supabaseAdmin) throw new Error("Supabase admin client is unavailable");
    const result = await fetchOddsPapiEsportsGames();
    const upserted = await upsertGames(result.games);
    const bySport = result.games.reduce((counts, game) => {
      counts[game.sport] = (counts[game.sport] ?? 0) + 1;
      return counts;
    }, {});
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
