import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  const { id } = await params;

  const { data: pick, error: pickError } = await admin.from("picks").select("id,ai_model,is_single_bet,status,settled_at,game_id").eq("id", id).maybeSingle();
  if (pickError) return NextResponse.json({ error: pickError.message }, { status: 500 });
  if (!pick || pick.ai_model !== "human" || pick.is_single_bet === false) return NextResponse.json({ error: "취소할 수 있는 픽이 아닙니다." }, { status: 404 });
  if (pick.status === "cancelled") return NextResponse.json({ error: "이미 취소된 픽입니다." }, { status: 400 });
  if (pick.settled_at) return NextResponse.json({ error: "이미 정산된 픽은 취소할 수 없습니다." }, { status: 400 });

  const { data: game, error: gameError } = await admin.from("games").select("status,commence_time").eq("id", pick.game_id).maybeSingle();
  if (gameError) return NextResponse.json({ error: gameError.message }, { status: 500 });
  if (!game || game.status !== "upcoming" || new Date(String(game.commence_time)).getTime() <= Date.now()) {
    return NextResponse.json({ error: "경기가 이미 시작되었거나 종료되어 취소할 수 없습니다." }, { status: 400 });
  }

  const { error, data } = await admin.from("picks").update({ status: "cancelled" }).eq("id", id).eq("status", "active").is("settled_at", null).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ error: "이미 다른 요청으로 처리되었습니다." }, { status: 409 });
  return NextResponse.json({ success: true });
}
