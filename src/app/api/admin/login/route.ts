import { NextResponse } from "next/server";
import { ADMIN_COOKIE, tokenForAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const token = await tokenForAdminPassword(String((await request.json()).password ?? ""));
  if (!token) return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
