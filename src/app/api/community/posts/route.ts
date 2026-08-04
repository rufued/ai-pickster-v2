import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { assertCommunityRateLimit, cleanCommunityInput, hashCommunityPassword, isCommunityCategory, requestIpHash } from "@/lib/community-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) throw new Error("SERVER_CONFIG");
    const admin = await isAdminRequest(request);
    const body = await request.json();
    const title = cleanCommunityInput(body.title, 120); const content = cleanCommunityInput(body.content, 10000);
    if (!isCommunityCategory(body.category) || !title || !content) {
      return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });
    }

    if (admin) {
      const passwordHash = await hashCommunityPassword(randomBytes(24).toString("hex"));
      const { data, error } = await supabaseAdmin.from("community_posts").insert({
        category: body.category, title, content, nickname: "SHadmin",
        password_hash: passwordHash, author_ip_hash: requestIpHash(request),
        is_admin: true, is_pinned: Boolean(body.pin),
      }).select("id").single();
      if (error) throw error;
      return NextResponse.json({ success: true, id: data.id }, { status: 201 });
    }

    const nickname = cleanCommunityInput(body.nickname, 30); const password = cleanCommunityInput(body.password, 72);
    if (nickname.length < 2 || password.length < 4) {
      return NextResponse.json({ error: "입력값을 확인해주세요." }, { status: 400 });
    }
    const ipHash = requestIpHash(request); await assertCommunityRateLimit(ipHash);
    const passwordHash = await hashCommunityPassword(password);
    const { data, error } = await supabaseAdmin.from("community_posts").insert({ category: body.category, title, content, nickname, password_hash: passwordHash, author_ip_hash: ipHash }).select("id").single();
    if (error) throw error;
    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "RATE_LIMIT") return NextResponse.json({ error: "30초 후 다시 작성해주세요." }, { status: 429 });
    console.error("community post create failed", error);
    return NextResponse.json({ error: "게시글을 저장하지 못했습니다." }, { status: 500 });
  }
}

