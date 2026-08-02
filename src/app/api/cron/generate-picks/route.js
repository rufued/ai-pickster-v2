// app/api/generate-picks/route.js
import { createClient } from "@supabase/supabase-js";
import { AI_MODELS, getPickFromModel } from "@/lib/ai-picks";

const MAX_GAMES_PER_RUN = 5; // 한 번 실행할 때 처리할 경기 수 (API 비용/시간 제한용)

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function getGamesNeedingPicks(supabase) {
  // upcoming 상태이고, 아직 픽이 하나도 없는 경기들만 가져옴
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "upcoming")
    .order("commence_time", { ascending: true })
    .limit(MAX_GAMES_PER_RUN);

  if (error) throw new Error(`Failed to fetch games: ${error.message}`);
  return games ?? [];
}

async function hasExistingPicks(supabase, gameId) {
  const { count, error } = await supabase
    .from("picks")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId);

  if (error) throw new Error(`Failed to check picks: ${error.message}`);
  return (count ?? 0) > 0;
}

async function savePick(supabase, game, modelKey, pick) {
  const oddsUsed =
    pick.pick_type === "home_win"
      ? game.home_odds
      : pick.pick_type === "away_win"
        ? game.away_odds
        : game.draw_odds;

  const { error } = await supabase.from("picks").insert({
    game_id: game.id,
    ai_model: modelKey,
    pick_type: pick.pick_type,
    pick_label: pick.pick_label,
    confidence: pick.confidence,
    analysis: pick.analysis,
    odds_used: oddsUsed ?? null,
  });

  if (error) throw new Error(`Failed to save pick: ${error.message}`);
}

export async function GET(request) {
  // cron 인증 (기존 /api/cron 과 동일한 방식)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();
  const supabase = getSupabaseClient();
  const results = [];

  try {
    const games = await getGamesNeedingPicks(supabase);

    for (const game of games) {
      const alreadyDone = await hasExistingPicks(supabase, game.id);
      if (alreadyDone) continue;

      for (const model of AI_MODELS) {
        try {
          const pick = await getPickFromModel(model.key, game);
          await savePick(supabase, game, model.key, pick);
          results.push({ game_id: game.id, model: model.key, status: "ok" });
        } catch (err) {
          // 한 AI가 실패해도 다른 AI/경기는 계속 진행
          results.push({
            game_id: game.id,
            model: model.key,
            status: "error",
            error: err.message,
          });
        }
      }
    }

    return Response.json({
      success: true,
      games_processed: games.length,
      results,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message,
        started_at: startedAt,
        finished_at: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
