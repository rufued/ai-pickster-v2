import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim();
  if (!name) return NextResponse.json({ logo: null });

  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(name)}`,
      { next: { revalidate: 60 * 60 * 24 * 7 } },
    );
    if (!response.ok) return NextResponse.json({ logo: null });

    const data = await response.json();
    const teams = Array.isArray(data?.teams) ? data.teams : [];
    const exact = teams.find((team: { strTeam?: string }) => team.strTeam?.toLowerCase() === name.toLowerCase());
    const team = exact ?? teams[0];
    const logo = team?.strBadge ?? team?.strTeamBadge ?? null;
    return NextResponse.json({ logo: typeof logo === "string" && logo.startsWith("https://") ? logo : null });
  } catch {
    return NextResponse.json({ logo: null });
  }
}
