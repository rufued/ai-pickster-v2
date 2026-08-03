import { notFound } from "next/navigation";
import { AiPill, signedCurrency } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function AiHistoryPage({ params }: { params: Promise<{ ai: string }> }) {
  const { ai: aiId } = await params;
  const { ais, bets } = await getLiveData();
  const ai = ais.find((item) => item.id === aiId);
  if (!ai) notFound();
  const rows = bets.filter((bet) => bet.aiId === aiId && (bet.status === "won" || bet.status === "lost"));
  return <main className="container-shell py-8"><AiPill aiId={aiId}/><h1 className="mt-3 text-3xl font-black text-slate-950">{ai.name} 정산 기록</h1><div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">{rows.map((bet) => <article key={bet.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><span className="text-sm font-bold text-slate-800">{bet.legs[0]?.homeTeam} vs {bet.legs[0]?.awayTeam}</span><span className={bet.profit >= 0 ? "font-black text-emerald-600" : "font-black text-red-600"}>{signedCurrency(bet.profit)}</span></article>)}</div>{rows.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">정산된 픽이 없습니다.</div> : null}</main>;
}
