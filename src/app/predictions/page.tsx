import { BetCard } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export const dynamic = "force-dynamic";

export default async function PredictionsPage() {
  const { bets } = await getLiveData();
  const upcoming = bets.filter((bet) => bet.status === "scheduled" || bet.status === "live");
  return <main className="container-shell py-8"><h1 className="text-3xl font-black text-slate-950">AI 픽</h1><p className="mt-2 text-sm text-slate-600">Supabase picks 테이블에서 생성된 실제 픽입니다.</p><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{upcoming.map((bet) => <BetCard key={bet.id} bet={bet}/>)}</div>{upcoming.length === 0 ? <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500">현재 예정된 픽이 없습니다.</div> : null}</main>;
}
