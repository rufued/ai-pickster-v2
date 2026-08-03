import { NextResponse } from "next/server";
import { cleanCommunityInput, verifyCommunityPassword } from "@/lib/community-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) throw new Error("SERVER_CONFIG");
    const { id } = await params; const { password: input } = await request.json(); const password = cleanCommunityInput(input, 72);
    const { data } = await supabaseAdmin.from("community_comments").select("password_hash").eq("id", id).maybeSingle();
    if (!data || !await verifyCommunityPassword(password, data.password_hash)) return NextResponse.json({ error: "비밀번호가 일치하지 않습니다." }, { status: 403 });
    const { error } = await supabaseAdmin.from("community_comments").delete().eq("id", id); if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) { console.error("community comment delete failed", error); return NextResponse.json({ error: "댓글을 삭제하지 못했습니다." }, { status: 500 }); }
}
