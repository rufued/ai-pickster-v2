import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

function option(game: Record<string, unknown>, pickType: string) {
  const map: Record<string, [string, unknown, unknown, string]> = {
    home_win: ["moneyline", game.home_odds, null, `${game.home_team} ML`], away_win: ["moneyline", game.away_odds, null, `${game.away_team} ML`], draw: ["moneyline", game.draw_odds, null, "Draw"],
    home_spread: ["spread", game.home_spread_odds, game.home_spread_point, `${game.home_team} ${game.home_spread_point}`], away_spread: ["spread", game.away_spread_odds, game.away_spread_point, `${game.away_team} ${game.away_spread_point}`],
    over: ["total", game.over_odds, game.total_point, `Over ${game.total_point}`], under: ["total", game.under_odds, game.total_point, `Under ${game.total_point}`],
  };
  const value = map[pickType]; if (!value || !Number.isFinite(Number(value[1]))) return null;
  return { market_type: value[0], odds_used: Number(value[1]), line_value: value[2] == null ? null : Number(value[2]), pick_label: value[3] };
}

export async function POST(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  const body = await request.json(); const legs: Array<{ game_id: string; pick_type: string }> = Array.isArray(body.legs) ? body.legs : [];
  const stake = Number(body.stake); const confidence = Number(body.confidence);
  const analysis = typeof body.analysis === "string" ? body.analysis.trim().slice(0, 4000) : "";
  if (!legs.length || !Number.isFinite(stake) || stake < 200 || stake > 10000 || !Number.isFinite(confidence) || confidence < 1 || confidence > 100) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });
  const ids = [...new Set(legs.map((leg) => String(leg.game_id)))];
  const { data: games, error } = await admin.from("games").select("*").in("id", ids).eq("status", "upcoming").gte("commence_time", new Date().toISOString());
  if (error || games?.length !== ids.length) return NextResponse.json({ error: "유효한 예정 경기가 아닙니다." }, { status: 400 });
  const { data: conflicts, error: conflictError } = await admin.from("picks").select("game_id").eq("ai_model", "human").eq("status", "active").is("settled_at", null).in("game_id", ids);
  if (conflictError && !/column .* does not exist/i.test(conflictError.message ?? "")) return NextResponse.json({ error: conflictError.message }, { status: 500 });
  if (conflicts?.length) return NextResponse.json({ error: "이미 진행 중인 픽이 있는 경기입니다. 먼저 취소한 뒤 다시 등록해주세요." }, { status: 400 });
  const gameMap = new Map(games.map((game) => [String(game.id), game]));
  const picks = legs.map((leg) => { const game = gameMap.get(String(leg.game_id)); const selected = game && option(game, String(leg.pick_type)); return selected ? { game_id: game.id, ai_model: "human", pick_type: String(leg.pick_type), confidence, analysis: analysis || "SHadmin이 별도 설명을 남기지 않았습니다.", stake, ...selected, is_single_bet: legs.length === 1 } : null; });
  if (picks.some((pick) => !pick)) return NextResponse.json({ error: "선택한 마켓의 배당이 없습니다." }, { status: 400 });
  const validPicks = picks.filter((pick): pick is NonNullable<typeof pick> => Boolean(pick));
  const { error: pickError } = await admin.from("picks").insert(validPicks);
  if (pickError) return NextResponse.json({ error: pickError.message }, { status: 500 });
  if (legs.length > 1) {
    const totalOdds = validPicks.reduce((value, pick) => value * pick.odds_used, 1);
    const signature = createHash("sha256").update(validPicks.map((pick) => `${pick.game_id}:${pick.pick_type}`).sort().join("|")).digest("hex").slice(0, 24);
    const { data: parlay, error: parlayError } = await admin.from("parlays").insert({ ai_model: "human", stake, total_odds: totalOdds, status: "pending", signature, bet_date: new Date().toISOString().slice(0, 10), is_auto_generated: false }).select("id").single();
    if (parlayError) return NextResponse.json({ error: parlayError.message }, { status: 500 });
    const { error: legError } = await admin.from("parlay_legs").insert(validPicks.map((pick, index) => ({ parlay_id: parlay.id, game_id: pick.game_id, ai_model: "human", leg_order: index })));
    if (legError) return NextResponse.json({ error: legError.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, type: legs.length > 1 ? "parlay" : "single", legs: legs.length });
}
