import { NextResponse } from "next/server";

import {
  refreshAiAssets,
  settlePicks,
  updateGameResults,
} from "@/lib/settlement";

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
    const gameResults = await updateGameResults();
    const pickResults = await settlePicks();
    const assetResults = await refreshAiAssets();

    return NextResponse.json({
      success: true,
      games: gameResults,
      picks: pickResults,
      ai_assets: assetResults,
      started_at: startedAt.toISOString(),
      finished_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Settlement failed", error);

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
