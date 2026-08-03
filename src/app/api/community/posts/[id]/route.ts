import { NextResponse } from "next/server";
import { cleanCommunityInput, isCommunityCategory, verifyCommunityPassword } from "@/lib/community-auth";
import { supabaseAdmin } from "@/lib/supabase";

async function authorized(id: string, password: string) {
  if (!supabaseAdmin) return false;
  const { data } = await supabaseAdmin.from("community_posts").select("password_hash").eq("id", id).maybeSingle();
  return Boolean(data && await verifyCommunityPassword(password, data.password_hash));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) throw new Error("SERVER_CONFIG");
    const { id } = await params; const body = await request.json();
    const title = cleanCommunityInput(body.title, 120); const content = cleanCommunityInput(body.content, 10000);
    const nickname = cleanCommunityInput(body.nickname, 30); const password = cleanCommunityInput(body.password, 72);
    if (!isCommunityCategory(body.category) || !title || !content || nickname.length < 2 || password.length < 4) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });
    if (!await authorized(id, password)) return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
    const { error } = await supabaseAdmin.from("community_posts").update({ category: body.category, title, content, nickname }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) { console.error("community post update failed", error); return NextResponse.json({ error: "게시글을 수정하지 못했습니다." }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) throw new Error("SERVER_CONFIG");
    const { id } = await params; const body = await request.json(); const password = cleanCommunityInput(body.password, 72);
    if (!await authorized(id, password)) return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
    const { error } = await supabaseAdmin.from("community_posts").delete().eq("id", id); if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) { console.error("community post delete failed", error); return NextResponse.json({ error: "게시글을 삭제하지 못했습니다." }, { status: 500 }); }
}

