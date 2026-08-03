import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

const jobs: Record<string, string> = { games: "/api/cron", esports: "/api/cron/esports", picks: "/api/generate-picks", settlement: "/api/settle", chat: "/api/generate-chat" };
export async function POST(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = String((await request.json()).job ?? ""); const path = jobs[job];
  if (!path) return NextResponse.json({ error: "Unknown job" }, { status: 400 });
  try { const response = await fetch(new URL(path, request.url), { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` }, cache: "no-store" }); const result = await response.json(); return NextResponse.json({ success: response.ok, result }, { status: response.ok ? 200 : 502 }); }
  catch { return NextResponse.json({ error: "실행 실패" }, { status: 500 }); }
}
