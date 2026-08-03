import { NextResponse } from "next/server";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getLiveData());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch live data" },
      { status: 500 },
    );
  }
}
