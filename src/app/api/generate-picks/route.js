// app/api/generate-picks/route.js
import { createClient } from "@supabase/supabase-js";
import { AI_MODELS, getPickFromModel } from "@/lib/ai-picks";
import { generateParlays } from "@/lib/parlay";

const MAX_GAMES_PER_RUN = 5; // 한 번 실행할 때 처리할 경기 수 (API 비용/시간 제한용)
const MAX_SINGLE_BETS_PER_AI_PER_DAY = 3;

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
    .gte("commence_time", new Date().toISOString())
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

async function getDailySingleCounts(supabase) {
  const dayStart = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  let { data, error } = await supabase.from("picks").select("ai_model,is_single_bet").gte("created_at", dayStart).eq("is_single_bet", true);
  let supportsSingleFlag = true;
  if (error?.message?.includes("schema cache")) {
    supportsSingleFlag = false;
    ({ data, error } = await supabase.from("picks").select("ai_model").gte("created_at", dayStart));
  }
  if (error) throw new Error(`Failed to count daily single bets: ${error.message}`);
  const counts = new Map();
  for (const row of data ?? []) counts.set(row.ai_model, (counts.get(row.ai_model) ?? 0) + 1);
  return { counts, supportsSingleFlag };
}

async function savePick(supabase, game, modelKey, pick, isSingleBet, supportsSingleFlag) {
  const values = {
    game_id: game.id,
    ai_model: modelKey,
    market_type: pick.market_type,
    pick_type: pick.pick_type,
    line_value: pick.line_value,
    pick_label: pick.pick_label,
    confidence: pick.confidence,
    analysis: pick.analysis,
    odds_used: pick.odds_used,
    ...(supportsSingleFlag ? { is_single_bet: isSingleBet } : {}),
  };
  let { error } = await supabase.from("picks").insert(values);

  // Keep legacy moneyline generation available until the migration is applied.
  if (error?.message?.includes("schema cache") && pick.market_type === "moneyline") {
    const { market_type, line_value, ...legacyValues } = values;
    void market_type; void line_value;
    ({ error } = await supabase.from("picks").insert(legacyValues));
  }

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
  let singleBetsCreated = 0;
  let comboOnlyPicksCreated = 0;

  try {
    const games = await getGamesNeedingPicks(supabase);
    const { counts: dailySingleCounts, supportsSingleFlag } = await getDailySingleCounts(supabase);

    for (const game of games) {
      const alreadyDone = await hasExistingPicks(supabase, game.id);
      if (alreadyDone) continue;

      for (const model of AI_MODELS) {
        try {
          const pick = await getPickFromModel(model.key, game);
          const isSingleBet = (dailySingleCounts.get(model.key) ?? 0) < MAX_SINGLE_BETS_PER_AI_PER_DAY;
          if (!supportsSingleFlag && !isSingleBet) {
            results.push({ game_id: game.id, model: model.key, status: "skipped", reason: "single_bet_daily_cap_schema_migration_required" });
            continue;
          }
          await savePick(supabase, game, model.key, pick, isSingleBet, supportsSingleFlag);
          if (isSingleBet) {
            dailySingleCounts.set(model.key, (dailySingleCounts.get(model.key) ?? 0) + 1);
            singleBetsCreated += 1;
          } else {
            comboOnlyPicksCreated += 1;
          }
          results.push({ game_id: game.id, model: model.key, status: "ok", bet_role: isSingleBet ? "single_and_parlay_candidate" : "parlay_candidate_only" });
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

    let parlays;
    try {
      parlays = await generateParlays(supabase, { favorCombinations: comboOnlyPicksCreated > 0 });
    } catch (err) {
      parlays = { status: "error", error: err.message };
    }

    return Response.json({
      success: true,
      games_processed: games.length,
      results,
      parlays,
      betting_mix: {
        single_bet_daily_cap_per_ai: MAX_SINGLE_BETS_PER_AI_PER_DAY,
        single_bets_created: singleBetsCreated,
        combo_only_picks_created: comboOnlyPicksCreated,
        parlay_bets_created: Number(parlays?.created ?? 0),
        single_to_parlay_ratio: Number(parlays?.created ?? 0) > 0 ? `${singleBetsCreated}:${parlays.created}` : `${singleBetsCreated}:0`,
      },
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
