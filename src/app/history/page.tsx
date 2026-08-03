import Link from "next/link";
import { AiPill, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { bets } = await getLiveData();
  const settled = bets.filter((bet) => bet.status === "won" || bet.status === "lost");
  return <main className="container-shell py-8"><h1 className="text-3xl font-black text-slate-950">정산 기록</h1><p className="mt-2 text-sm text-slate-600">실제로 정산된 picks 데이터만 표시합니다.</p><div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">{settled.map((bet) => <Link key={bet.id} href={`/picks/${bet.id}`} className="grid gap-3 p-4 hover:bg-slate-50 sm:grid-cols-[180px_1fr_auto] sm:items-center"><AiPill aiId={bet.aiId}/><span className="text-sm font-bold text-slate-800">{bet.legs[0]?.homeTeam} vs {bet.legs[0]?.awayTeam}</span><span className={bet.profit >= 0 ? "font-black text-emerald-600" : "font-black text-red-600"}>{signedCurrency(bet.profit)}</span></Link>)}</div>{settled.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">정산된 픽이 없습니다.</div> : null}</main>;
}
