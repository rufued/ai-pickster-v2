// app/api/generate-picks/route.js
import { createClient } from "@supabase/supabase-js";
import { AI_MODELS, getPickFromModel } from "@/lib/ai-picks";
import { generateParlays } from "@/lib/parlay";
import { logCronRun } from "@/lib/cron-log";
import { confidenceStake, getAiBalances, DEFAULT_AI_BALANCE } from "@/lib/stake";

const MAX_GAMES_PER_RUN = 5; // 한 번 실행할 때 처리할 경기 수 (API 비용/시간 제한용)
const MAX_SINGLE_BETS_PER_AI_PER_DAY = 3;

function isMissingColumn(error, column) {
  const message = error?.message?.toLowerCase() ?? "";
  return message.includes(column.toLowerCase()) && (message.includes("schema cache") || message.includes("does not exist") || error?.code === "PGRST204");
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

async function getGamesNeedingPicks(supabase) {
  // Fetch a wider upcoming window first so already-covered early games do not
  // permanently block newer games behind the per-run processing limit.
  const { data: games, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "upcoming")
    .gte("commence_time", new Date().toISOString())
    .order("commence_time", { ascending: true })
    .limit(50);

  if (error) throw new Error(`Failed to fetch games: ${error.message}`);
  if (!games?.length) return [];

  const gameIds = games.map((game) => game.id);
  const { data: existing, error: picksError } = await supabase
    .from("picks")
    .select("game_id,ai_model")
    .in("game_id", gameIds);
  if (picksError) throw new Error(`Failed to find games needing picks: ${picksError.message}`);

  const covered = new Map();
  for (const pick of existing ?? []) {
    covered.set(pick.game_id, new Set([...(covered.get(pick.game_id) ?? []), pick.ai_model]));
  }
  return games
    .filter((game) => AI_MODELS.some((model) => !covered.get(game.id)?.has(model.key)))
    .slice(0, MAX_GAMES_PER_RUN);
}

async function getExistingPickModels(supabase, gameId) {
  const { data, error } = await supabase
    .from("picks")
    .select("ai_model")
    .eq("game_id", gameId);

  if (error) throw new Error(`Failed to check picks: ${error.message}`);
  return new Set((data ?? []).map((pick) => pick.ai_model));
}

async function getDailySingleCounts(supabase) {
  const dayStart = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  let { data, error } = await supabase.from("picks").select("ai_model,is_single_bet").gte("created_at", dayStart).eq("is_single_bet", true);
  let supportsSingleFlag = true;
  if (isMissingColumn(error, "is_single_bet")) {
    supportsSingleFlag = false;
    ({ data, error } = await supabase.from("picks").select("ai_model").gte("created_at", dayStart));
  }
  if (error) throw new Error(`Failed to count daily single bets: ${error.message}`);
  const counts = new Map();
  for (const row of data ?? []) counts.set(row.ai_model, (counts.get(row.ai_model) ?? 0) + 1);
  return { counts, supportsSingleFlag };
}

async function savePick(supabase, game, modelKey, pick, stake, isSingleBet, supportsSingleFlag) {
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
    stake,
    ...(supportsSingleFlag ? { is_single_bet: isSingleBet } : {}),
  };
  let { data, error } = await supabase.from("picks").insert(values).select("id").single();

  // Keep legacy moneyline generation available until the migration is applied.
  if ((isMissingColumn(error, "market_type") || isMissingColumn(error, "line_value")) && pick.market_type === "moneyline") {
    const { market_type, line_value, ...legacyValues } = values;
    void market_type; void line_value;
    ({ data, error } = await supabase.from("picks").insert(legacyValues).select("id").single());
  }

  if (error) throw new Error(`Failed to save pick: ${error.message}`);
  return data;
}

async function promoteUnusedParlayCandidates(supabase, candidates) {
  if (!candidates.length) return { linked: [], promoted: [] };

  const gameIds = [...new Set(candidates.map((candidate) => candidate.gameId))];
  const { data: legs, error: legsError } = await supabase
    .from("parlay_legs")
    .select("game_id,ai_model")
    .in("game_id", gameIds);
  if (legsError) throw new Error(`Failed to reconcile parlay candidates: ${legsError.message}`);

  const linkedKeys = new Set((legs ?? []).map((leg) => `${leg.game_id}:${leg.ai_model}`));
  const linked = candidates.filter((candidate) => linkedKeys.has(`${candidate.gameId}:${candidate.model}`));
  const promoted = candidates.filter((candidate) => !linkedKeys.has(`${candidate.gameId}:${candidate.model}`));

  if (promoted.length) {
    const { error: promoteError } = await supabase
      .from("picks")
      .update({ is_single_bet: true })
      .in("id", promoted.map((candidate) => candidate.id));
    if (promoteError) throw new Error(`Failed to promote unused parlay candidates: ${promoteError.message}`);
  }

  return { linked, promoted };
}

async function getTodaysPendingParlayOnlyCandidates(supabase, since) {
  const { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("id,game_id,ai_model,confidence,stake")
    .eq("is_single_bet", false)
    .is("settled_at", null)
    .gte("created_at", since);
  if (picksError) throw new Error(`Failed to fetch pending parlay-only picks: ${picksError.message}`);
  if (!picks?.length) return [];

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id")
    .in("id", [...new Set(picks.map((pick) => pick.game_id))])
    .eq("status", "upcoming")
    .gte("commence_time", new Date().toISOString());
  if (gamesError) throw new Error(`Failed to validate pending parlay-only picks: ${gamesError.message}`);

  const upcomingIds = new Set((games ?? []).map((game) => game.id));
  return picks
    .filter((pick) => upcomingIds.has(pick.game_id))
    .map((pick) => ({
      id: pick.id,
      gameId: pick.game_id,
      model: pick.ai_model,
      confidence: pick.confidence,
      stake: pick.stake,
    }));
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
  const singleStakesCreated = [];
  const newParlayOnlyCandidates = [];

  try {
    const games = await getGamesNeedingPicks(supabase);
    const { counts: dailySingleCounts, supportsSingleFlag } = await getDailySingleCounts(supabase);
    const aiBalances = await getAiBalances(supabase);

    console.log(`[generate-picks] processing ${games.length} game(s) for models: ${AI_MODELS.map((m) => m.key).join(", ")}`);

    for (const game of games) {
      let existingModels;
      try {
        existingModels = await getExistingPickModels(supabase, game.id);
      } catch (err) {
        console.error(`[generate-picks] existing_pick_check failed for game=${game.id}:`, err);
        for (const model of AI_MODELS) {
          results.push({
            game_id: game.id,
            model: model.key,
            status: "error",
            stage: "existing_pick_check",
            error: err instanceof Error ? err.message : String(err),
          });
        }
        continue;
      }

      for (const model of AI_MODELS) {
        if (existingModels.has(model.key)) {
          console.log(`[generate-picks] skip game=${game.id} model=${model.key}: pick already exists`);
          results.push({
            game_id: game.id,
            model: model.key,
            status: "skipped",
            reason: "pick_already_exists_for_game_and_model",
          });
          continue;
        }

        try {
          console.log(`[generate-picks] requesting pick from model=${model.key} game=${game.id} (${game.home_team} vs ${game.away_team})`);
          const pick = await getPickFromModel(model.key, game);
          const isSingleBet = (dailySingleCounts.get(model.key) ?? 0) < MAX_SINGLE_BETS_PER_AI_PER_DAY;
          if (!supportsSingleFlag && !isSingleBet) {
            console.log(`[generate-picks] skip game=${game.id} model=${model.key}: single_bet_daily_cap_schema_migration_required`);
            results.push({ game_id: game.id, model: model.key, status: "skipped", reason: "single_bet_daily_cap_schema_migration_required" });
            continue;
          }
          const stake = confidenceStake(pick.confidence, {
            balance: aiBalances.get(model.key) ?? DEFAULT_AI_BALANCE,
            seed: `${game.id}:${model.key}:${pick.market_type}:${pick.pick_type}`,
            aiModel: model.key,
          });
          const savedPick = await savePick(supabase, game, model.key, pick, stake, isSingleBet, supportsSingleFlag);
          console.log(`[generate-picks] saved pick id=${savedPick.id} model=${model.key} game=${game.id} pick_type=${pick.pick_type} confidence=${pick.confidence} stake=${stake} single_bet=${isSingleBet}`);
          if (isSingleBet) {
            dailySingleCounts.set(model.key, (dailySingleCounts.get(model.key) ?? 0) + 1);
            singleBetsCreated += 1;
            singleStakesCreated.push({ ai_model: model.key, confidence: pick.confidence, stake });
          } else {
            comboOnlyPicksCreated += 1;
          }
          const result = { game_id: game.id, model: model.key, status: "ok", bet_role: isSingleBet ? "single_and_parlay_candidate" : "parlay_candidate_only", confidence: pick.confidence, stake };
          results.push(result);
          if (!isSingleBet) {
            newParlayOnlyCandidates.push({ id: savedPick.id, gameId: game.id, model: model.key, confidence: pick.confidence, stake, result });
          }
        } catch (err) {
          // 한 AI가 실패해도 다른 AI/경기는 계속 진행 — 단, 반드시 로그로 남긴다 (results 배열은
          // JSON 응답에만 담기고 Vercel 로그에는 안 찍히므로, 여기서 console.error를 안 하면
          // cron으로 조용히 실행됐을 때 실패 사유를 확인할 방법이 없다).
          console.error(`[generate-picks] generate_or_save_pick failed for model=${model.key} game=${game.id}:`, err);
          results.push({
            game_id: game.id,
            model: model.key,
            status: "error",
            stage: "generate_or_save_pick",
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    let parlays;
    try {
      parlays = await generateParlays(supabase, { favorCombinations: comboOnlyPicksCreated > 0, aiBalances });
    } catch (err) {
      console.error("[generate-picks] generateParlays failed:", err);
      parlays = { status: "error", error: err.message };
    }

    let candidateReconciliation = { checked: 0, linked: 0, promoted_to_single: 0, promoted_from_current_run: 0 };
    try {
      const dayStart = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
      const pendingCandidates = await getTodaysPendingParlayOnlyCandidates(supabase, dayStart);
      const resultById = new Map(newParlayOnlyCandidates.map((candidate) => [candidate.id, candidate.result]));
      const newIds = new Set(newParlayOnlyCandidates.map((candidate) => candidate.id));
      const reconciled = await promoteUnusedParlayCandidates(supabase, pendingCandidates);
      for (const candidate of reconciled.linked) {
        const result = resultById.get(candidate.id);
        if (result) result.bet_role = "parlay_leg";
      }
      const promotedFromCurrentRun = reconciled.promoted.filter((candidate) => newIds.has(candidate.id));
      for (const candidate of promotedFromCurrentRun) {
        const result = resultById.get(candidate.id);
        if (result) {
          result.bet_role = "single_fallback_after_unused_parlay_candidate";
          result.fallback_reason = "not_linked_to_any_parlay";
        }
        singleStakesCreated.push({ ai_model: candidate.model, confidence: candidate.confidence, stake: candidate.stake, fallback: true });
      }
      singleBetsCreated += promotedFromCurrentRun.length;
      comboOnlyPicksCreated -= promotedFromCurrentRun.length;
      candidateReconciliation = {
        checked: pendingCandidates.length,
        linked: reconciled.linked.length,
        promoted_to_single: reconciled.promoted.length,
        promoted_from_current_run: promotedFromCurrentRun.length,
      };
    } catch (err) {
      console.error("[generate-picks] candidate reconciliation failed:", err);
      candidateReconciliation = { checked: 0, linked: 0, promoted_to_single: 0, promoted_from_current_run: 0, status: "error", error: err instanceof Error ? err.message : String(err) };
    }

    const errorResults = results.filter((result) => result.status === "error");
    console.log(
      `[generate-picks] done: games=${games.length} ok=${results.filter((r) => r.status === "ok").length} skipped=${results.filter((r) => r.status === "skipped").length} errors=${errorResults.length} single_bets=${singleBetsCreated} combo_only=${comboOnlyPicksCreated} parlays_created=${Number(parlays?.created ?? 0)}`,
    );
    if (errorResults.length) console.error("[generate-picks] per-model errors this run:", JSON.stringify(errorResults));

    await logCronRun("picks", "success", startedAt, { games_processed: games.length, single_bets_created: singleBetsCreated, parlay_bets_created: Number(parlays?.created ?? 0) });
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
        candidate_reconciliation: candidateReconciliation,
      },
      stake_summary: {
        policy: {
          balance_fraction: "1-8% before AI style adjustment",
          hard_min: 200,
          max: 10000,
          max_balance_fraction: 0.1,
          rounding: "$100 below $1,000, otherwise $250",
          variation: "±10%",
        },
        singles: singleStakesCreated,
        parlays: (parlays?.parlays ?? []).map((parlay) => ({ ai_model: parlay.ai_model, average_confidence: parlay.average_confidence, stake: parlay.stake })),
      },
      started_at: startedAt,
      finished_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[generate-picks] top-level failure:", err);
    await logCronRun("picks", "error", startedAt, { error: err.message });
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
