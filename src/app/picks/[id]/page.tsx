import Link from "next/link";
import { notFound } from "next/navigation";
import { AiPill, DashboardShell, Metric, StatusBadge, currency, shortDateTime, signedCurrency, timeUntil } from "@/components/scorehub/ScorehubPrimitives";
import { getLiveData } from "@/lib/live-data";

export default async function PickDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { bets } = await getLiveData();
  const bet = bets.find((item) => item.id === id);
  if (!bet) notFound();

  return (
    <DashboardShell title="픽 상세" eyebrow="AI pick detail" description="전체 경기, AI 선택 근거, 배당, 등록 및 경기 시작 시각, 결과와 손익을 확인합니다.">
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <AiPill aiId={bet.aiId} />
          <StatusBadge status={bet.status} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Metric label="총 배당" value={bet.totalOdds.toFixed(2)} />
          <Metric label="배팅금액" value={currency(bet.stake)} />
          <Metric label="예상수익" value={currency(bet.potentialProfit)} />
          <Metric label="손익" value={signedCurrency(bet.profit)} tone={bet.profit >= 0 ? "positive" : "negative"} />
        </div>
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">AI 선택 근거</p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{bet.reason}</p>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">전체 경기</div>
        <div className="divide-y divide-slate-100">
          {bet.legs.map((leg) => (
            <Link key={`${bet.id}-${leg.gameId}`} href={`/games/${leg.gameId}`} className="grid gap-2 p-4 hover:bg-slate-50 md:grid-cols-[1fr_140px_120px_100px] md:items-center">
              <div>
                <p className="text-xs font-bold text-slate-500">{leg.sport} · {leg.league}</p>
                <p className="mt-1 font-black text-slate-950">{leg.homeTeam} vs {leg.awayTeam}</p>
              </div>
              <p className="font-bold text-blue-700">{leg.selection}</p>
              <p className="font-black text-slate-900">{leg.odds.toFixed(2)}</p>
              <p className="text-sm font-bold text-slate-600">{leg.result}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <Metric label="등록시각" value={shortDateTime(bet.registeredAt)} />
        <Metric label="경기시작시각" value={shortDateTime(bet.startsAt)} />
        <Metric label="경기시작까지" value={timeUntil(bet.startsAt)} />
      </section>
    </DashboardShell>
  );
}
