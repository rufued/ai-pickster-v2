import Link from "next/link";
import { TeamMatchup } from "@/components/sports/SportsBrand";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function AnalysisPage() {
  const { games } = await getLiveData();
  const rows = games.filter((game) => game.predictions.length > 0);
  return <main className="container-shell py-8"><h1 className="text-3xl font-black text-slate-950">경기별 AI 예측</h1><p className="mt-2 text-sm text-slate-600">실제 games와 picks 데이터만 표시합니다.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{rows.map((game) => <Link key={game.id} href={`/analysis/${game.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300"><p className="text-xs font-black text-blue-700">{game.league}</p><h2 className="mt-2 text-lg font-black text-slate-950"><TeamMatchup homeTeam={game.homeTeam} awayTeam={game.awayTeam} /></h2><p className="mt-3 text-sm font-bold text-slate-500">AI 픽 {game.predictions.length}개</p></Link>)}</div>{rows.length === 0 ? <Empty text="아직 생성된 AI 예측이 없습니다." /> : null}</main>;
}
function Empty({ text }: { text: string }) { return <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">{text}</div>; }
