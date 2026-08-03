import { NextRequest, NextResponse } from "next/server";

const LEAGUE_IDS: Record<string, string> = {
  "premier league": "4328",
  epl: "4328",
  "uefa champions league": "4480",
  ucl: "4480",
  "la liga": "4335",
  nba: "4387",
  mlb: "4424",
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim().toLowerCase();
  const leagueId = name ? LEAGUE_IDS[name] : undefined;
  if (!leagueId) return NextResponse.json({ logo: null });

  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/123/lookupleague.php?id=${leagueId}`,
      { next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    if (!response.ok) return NextResponse.json({ logo: null });

    const data = await response.json();
    const league = Array.isArray(data?.leagues) ? data.leagues[0] : null;
    const logo = league?.strBadge ?? null;
    return NextResponse.json({ logo: typeof logo === "string" && logo.startsWith("https://") ? logo : null });
  } catch {
    return NextResponse.json({ logo: null });
  }
}
