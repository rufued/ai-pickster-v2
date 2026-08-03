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
    const { error } = await supabaseAdmin
      .from("games")
      .upsert(games, { onConflict: "id" });

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
