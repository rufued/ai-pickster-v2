import { createHash } from "node:crypto";

const MIN_LEGS = 2;

function validPick(pick) {
  const confidence = Number(pick.confidence);
  const odds = Number(pick.odds_used);
  return (
    pick.game_id &&
    Number.isFinite(confidence) &&
    Number.isFinite(odds) &&
    odds > 1
  );
}

function uniqueCombinations(picks) {
  const sorted = [...picks].filter(validPick).sort((a, b) => Number(b.confidence) - Number(a.confidence));
  if (sorted.length < MIN_LEGS) return [];

  const strong = sorted.filter((pick) => Number(pick.confidence) >= 70);
  const qualified = sorted.filter((pick) => Number(pick.confidence) >= 60);
  const candidates = [
    sorted.slice(0, Math.min(strong.length >= 2 ? strong.length : 2, 3)),
    qualified.length >= 2 ? qualified : sorted.slice(0, 2),
    sorted,
  ];
  const seen = new Set();

  return candidates.filter((combination) => {
    if (combination.length < MIN_LEGS) return false;
    const key = combination.map((pick) => pick.game_id).sort().join(":");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function totalOdds(picks) {
  return Number(picks.reduce((total, pick) => total * Number(pick.odds_used), 1).toFixed(4));
}

function stakeFor(picks) {
  const averageConfidence = picks.reduce((sum, pick) => sum + Number(pick.confidence), 0) / picks.length;
  if (averageConfidence >= 80) return 3000;
  if (averageConfidence >= 70) return 2000;
  return 1000;
}

function signatureFor(picks) {
  return createHash("sha256")
    .update(picks.map((pick) => pick.game_id).sort().join(":"))
    .digest("hex")
    .slice(0, 24);
}

export async function generateParlays(supabase, { since = new Date(Date.now() - 24 * 60 * 60 * 1000) } = {}) {
  const { data: picks, error: picksError } = await supabase
    .from("picks")
    .select("game_id,ai_model,confidence,odds_used,created_at")
    .gte("created_at", since.toISOString())
    .is("settled_at", null);

  if (picksError) throw new Error(`Failed to fetch parlay candidates: ${picksError.message}`);

  const gameIds = [...new Set((picks ?? []).map((pick) => pick.game_id))];
  if (!gameIds.length) return { candidates: 0, created: 0, skipped: 0, parlays: [] };

  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id,status,commence_time")
    .in("id", gameIds)
    .eq("status", "upcoming")
    .gte("commence_time", new Date().toISOString());

  if (gamesError) throw new Error(`Failed to validate parlay games: ${gamesError.message}`);
  const upcomingIds = new Set((games ?? []).map((game) => game.id));
  const eligible = (picks ?? []).filter((pick) => upcomingIds.has(pick.game_id));
  const byModel = new Map();
  for (const pick of eligible) byModel.set(pick.ai_model, [...(byModel.get(pick.ai_model) ?? []), pick]);

  const result = { candidates: 0, created: 0, skipped: 0, parlays: [] };
  const betDate = new Date().toISOString().slice(0, 10);

  for (const [aiModel, modelPicks] of byModel) {
    for (const combination of uniqueCombinations(modelPicks)) {
      result.candidates += 1;
      const signature = signatureFor(combination);
      const { data: existing, error: existingError } = await supabase
        .from("parlays")
        .select("id")
        .eq("ai_model", aiModel)
        .eq("bet_date", betDate)
        .eq("signature", signature)
        .maybeSingle();

      if (existingError) throw new Error(`Failed to check existing parlay: ${existingError.message}`);
      if (existing) {
        result.skipped += 1;
        continue;
      }

      const values = {
        ai_model: aiModel,
        stake: stakeFor(combination),
        total_odds: totalOdds(combination),
        status: "pending",
        bet_date: betDate,
        signature,
      };
      const { data: parlay, error: parlayError } = await supabase.from("parlays").insert(values).select("id").single();
      if (parlayError) throw new Error(`Failed to create parlay: ${parlayError.message}`);

      const legs = combination.map((pick, index) => ({
        parlay_id: parlay.id,
        game_id: pick.game_id,
        ai_model: aiModel,
        leg_order: index,
      }));
      const { error: legsError } = await supabase.from("parlay_legs").insert(legs);
      if (legsError) {
        await supabase.from("parlays").delete().eq("id", parlay.id);
        throw new Error(`Failed to create parlay legs: ${legsError.message}`);
      }

      result.created += 1;
      result.parlays.push({ id: parlay.id, ai_model: aiModel, legs: legs.length, ...values });
    }
  }

  return result;
}
