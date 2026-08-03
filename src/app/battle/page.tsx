import Link from "next/link";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function BattlePage() {
  const { games } = await getLiveData();
  const rows = games.filter((game) => game.predictions.length >= 2);
  return <main className="container-shell py-8"><h1 className="text-3xl font-black text-slate-950">AI 배틀</h1><p className="mt-2 text-sm text-slate-600">같은 경기에 실제 픽을 생성한 AI만 비교합니다.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{rows.map((game) => <Link key={game.id} href={`/battle/${game.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-black text-blue-700">{game.league}</p><h2 className="mt-2 text-lg font-black text-slate-950"><TeamMatchup homeTeam={game.homeTeam} awayTeam={game.awayTeam} /></h2><p className="mt-3 text-sm font-bold text-slate-500">참여 AI {game.predictions.length}</p></Link>)}</div>{rows.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">비교 가능한 실제 픽이 없습니다.</div> : null}</main>;
}
