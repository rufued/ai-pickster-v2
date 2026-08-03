import { NextResponse } from "next/server";

import { fetchAllGames, LOOKAHEAD_HOURS } from "@/lib/odds-api";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const startedAt = new Date();
  const cronSecret = process.env.CRON_SECRET;

  if (
    !cronSecret ||
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client is unavailable");
    }

    const games = await fetchAllGames();
    const bySport = games.reduce((counts, game) => {
      counts[game.sport] = (counts[game.sport] ?? 0) + 1;
      return counts;
    }, {});
    let { error } = await supabaseAdmin
      .from("games")
      .upsert(games, { onConflict: "id" });

    if (error?.message?.includes("schema cache")) {
      const legacyGames = games.map(({ home_spread_point, away_spread_point, home_spread_odds, away_spread_odds, total_point, over_odds, under_odds, ...game }) => {
        void home_spread_point; void away_spread_point; void home_spread_odds; void away_spread_odds; void total_point; void over_odds; void under_odds;
        return game;
      });
      ({ error } = await supabaseAdmin.from("games").upsert(legacyGames, { onConflict: "id" }));
    }

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      fetched: games.length,
      upserted: games.length,
      lookahead_hours: LOOKAHEAD_HOURS,
      by_sport: bySport,
      started_at: startedAt.toISOString(),
      finished_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron sync failed", error);

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
