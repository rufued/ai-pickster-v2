import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  const { id } = await params;

  const { data: parlay, error: parlayError } = await admin.from("parlays").select("id,ai_model,status,settled_at").eq("id", id).maybeSingle();
  if (parlayError) return NextResponse.json({ error: parlayError.message }, { status: 500 });
  if (!parlay || parlay.ai_model !== "human") return NextResponse.json({ error: "취소할 수 있는 조합이 아닙니다." }, { status: 404 });
  if (parlay.status !== "pending" || parlay.settled_at) return NextResponse.json({ error: "이미 정산되었거나 취소된 조합입니다." }, { status: 400 });

  const { data: legs, error: legsError } = await admin.from("parlay_legs").select("game_id").eq("parlay_id", id);
  if (legsError) return NextResponse.json({ error: legsError.message }, { status: 500 });
  const gameIds = [...new Set((legs ?? []).map((leg) => String(leg.game_id)))];
  if (!gameIds.length) return NextResponse.json({ error: "조합에 포함된 경기를 찾을 수 없습니다." }, { status: 400 });

  const { data: games, error: gamesError } = await admin.from("games").select("id,status,commence_time").in("id", gameIds);
  if (gamesError) return NextResponse.json({ error: gamesError.message }, { status: 500 });
  const started = (games ?? []).some((game) => game.status !== "upcoming" || new Date(String(game.commence_time)).getTime() <= Date.now());
  if (started || (games?.length ?? 0) !== gameIds.length) {
    return NextResponse.json({ error: "포함된 경기가 이미 시작되었거나 종료되어 조합을 취소할 수 없습니다." }, { status: 400 });
  }

  const { error: cancelError, data: cancelled } = await admin.from("parlays").update({ status: "cancelled" }).eq("id", id).eq("status", "pending").select("id");
  if (cancelError) return NextResponse.json({ error: cancelError.message }, { status: 500 });
  if (!cancelled?.length) return NextResponse.json({ error: "이미 다른 요청으로 처리되었습니다." }, { status: 409 });

  const { error: legPickError } = await admin.from("picks").update({ status: "cancelled" }).eq("ai_model", "human").eq("is_single_bet", false).in("game_id", gameIds).is("settled_at", null).eq("status", "active");
  if (legPickError) return NextResponse.json({ error: legPickError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
