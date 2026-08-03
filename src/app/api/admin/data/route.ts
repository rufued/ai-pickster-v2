import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getOddsPapiAccountUsage } from "@/lib/oddspapi";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!await isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = supabaseAdmin;
  if (!admin) return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  const now = new Date().toISOString();
  const [games, gameCount, pickCount, parlayCount, runs, oddsPapi] = await Promise.all([
    admin.from("games").select("id,sport,sport_label,home_team,away_team,commence_time,home_odds,away_odds,draw_odds,home_spread_point,away_spread_point,home_spread_odds,away_spread_odds,total_point,over_odds,under_odds").eq("status", "upcoming").gte("commence_time", now).order("commence_time").limit(100),
    admin.from("games").select("id", { count: "exact", head: true }),
    admin.from("picks").select("id", { count: "exact", head: true }),
    admin.from("parlays").select("id", { count: "exact", head: true }),
    admin.from("cron_runs").select("job_name,status,started_at,finished_at,details").order("started_at", { ascending: false }).limit(20),
    getOddsPapiAccountUsage().catch(() => null),
  ]);
  if (games.error) return NextResponse.json({ error: games.error.message }, { status: 500 });
  return NextResponse.json({
    games: games.data ?? [],
    counts: { games: gameCount.count ?? 0, picks: pickCount.count ?? 0, parlays: parlayCount.count ?? 0 },
    runs: runs.error ? [] : runs.data ?? [],
    providers: { oddsPapi, theOddsApi: { configured: Boolean(process.env.ODDS_API_KEY), usage: "응답 헤더 기반 사용량 미제공" } },
    migrationRequired: Boolean(runs.error),
  });
}
