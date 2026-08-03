import { NextResponse } from "next/server";
import { assertCommunityRateLimit, cleanCommunityInput, hashCommunityPassword, requestIpHash } from "@/lib/community-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!supabaseAdmin) throw new Error("SERVER_CONFIG");
    const { id } = await params; const body = await request.json();
    const content = cleanCommunityInput(body.content, 2000); const nickname = cleanCommunityInput(body.nickname, 30); const password = cleanCommunityInput(body.password, 72);
    if (!content || nickname.length < 2 || password.length < 4) return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });
    const ipHash = requestIpHash(request); await assertCommunityRateLimit(ipHash);
    const passwordHash = await hashCommunityPassword(password);
    const { error } = await supabaseAdmin.from("community_comments").insert({ post_id: id, content, nickname, password_hash: passwordHash, author_ip_hash: ipHash });
    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "RATE_LIMIT") return NextResponse.json({ error: "30초 후 다시 작성해주세요." }, { status: 429 });
    console.error("community comment create failed", error); return NextResponse.json({ error: "댓글을 저장하지 못했습니다." }, { status: 500 });
  }
}

