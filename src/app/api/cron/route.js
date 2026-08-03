import { NextResponse } from "next/server";

import { fetchAllGames, LOOKAHEAD_HOURS } from "@/lib/odds-api";
import { getOddsPapiAccountUsage } from "@/lib/oddspapi";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function upsertGames(games) {
  if (!games.length) return 0;
  let { error } = await supabaseAdmin.from("games").upsert(games, { onConflict: "id" });
  if (error?.message?.includes("schema cache")) {
    const legacyGames = games.map(({ home_spread_point, away_spread_point, home_spread_odds, away_spread_odds, total_point, over_odds, under_odds, ...game }) => {
      void home_spread_point; void away_spread_point; void home_spread_odds; void away_spread_odds; void total_point; void over_odds; void under_odds;
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

  if (
    !cronSecret ||
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (new URL(request.url).searchParams.get("account") === "1") {
    try {
      return NextResponse.json({ success: true, account: await getOddsPapiAccountUsage() });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "Unknown error" },
        { status: 502 },
      );
    }
  }

  try {
    if (!supabaseAdmin) {
      throw new Error("Supabase admin client is unavailable");
    }

    const sources = {};
    const theOddsResult = await Promise.resolve(fetchAllGames()).then(
      (value) => ({ status: "fulfilled", value }),
      (reason) => ({ status: "rejected", reason }),
    );
    const games = [];
    if (theOddsResult.status === "fulfilled") {
      try {
        const upserted = await upsertGames(theOddsResult.value);
        games.push(...theOddsResult.value);
        sources.the_odds_api = { status: "ok", fetched: theOddsResult.value.length, upserted, lookahead_hours: LOOKAHEAD_HOURS };
      } catch (error) {
        sources.the_odds_api = { status: "error", error: error instanceof Error ? error.message : String(error) };
      }
    } else {
      sources.the_odds_api = { status: "error", error: theOddsResult.reason instanceof Error ? theOddsResult.reason.message : String(theOddsResult.reason) };
    }
    if (Object.values(sources).every((source) => source.status === "error")) throw new Error("The Odds API sync failed");

    const bySport = games.reduce((counts, game) => {
      counts[game.sport] = (counts[game.sport] ?? 0) + 1;
      return counts;
    }, {});
    return NextResponse.json({
      success: true,
      fetched: games.length,
      upserted: games.length,
      lookahead_hours: LOOKAHEAD_HOURS,
      by_sport: bySport,
      sources,
      esports_sync: "separate_cron",
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
