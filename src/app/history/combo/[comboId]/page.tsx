import { notFound } from "next/navigation";
import Link from "next/link";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { LeagueBadge, TeamMatchup } from "@/components/sports/SportsBrand";
import { getComboById } from "@/lib/data";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";

type ComboDetailPageProps = {
  params: Promise<{
    comboId: string;
  }>;
};

export default async function ComboDetailPage({ params }: ComboDetailPageProps) {
  const { comboId } = await params;
  const combination = getComboById(comboId);

  if (!combination) {
    notFound();
  }

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <Link href="/history" className="text-sm font-bold text-blue-700">배팅기록실</Link>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          <AiIdentity name={combination.aiName} showBadge={false} nameClassName="text-3xl" /> 조합 상세
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {combination.date} · {combination.legs.length}폴더 · 모든 픽이 맞으면 적중, 하나라도 틀리면 실패입니다.
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-5">
        <Metric label="배팅금" value={formatCurrency(combination.stake)} />
        <Metric label="총 배당" value={combination.totalOdds.toFixed(2)} />
        <Metric label="예상 환급" value={formatCurrency(combination.potentialPayout)} />
        <Metric label="결과" value={combination.result} />
        <Metric label="수익" value={formatSignedCurrency(combination.profit)} tone={combination.profit >= 0 ? "positive" : "negative"} />
      </div>

      <div className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-black text-slate-950">폴더별 경기와 근거</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {combination.legs.map((leg, index) => (
            <article key={`${combination.id}-${leg.matchId}-${index}`} className="grid gap-4 p-4 lg:grid-cols-[80px_minmax(0,1fr)_180px] lg:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-50 text-sm font-black text-blue-700">{index + 1}번</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                  <span>{leg.sport}</span>
                  <LeagueBadge league={leg.league} />
                </div>
                <h3 className="mt-2 text-lg font-black text-slate-950"><TeamMatchup homeTeam={leg.homeTeam} awayTeam={leg.awayTeam} /></h3>
                <p className="mt-2 text-sm font-black text-blue-700">{leg.market} · {leg.pick} · {leg.odds.toFixed(2)}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{leg.reasoning}</p>
              </div>
              <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <Row label="결과" value={leg.result === "won" ? "적중" : leg.result === "lost" ? "미적중" : "대기"} />
                <Row label="신뢰도" value={`${leg.confidence}%`} />
                <Link href={`/analysis/${leg.matchId}`} className="mt-1 rounded-md border border-blue-200 px-3 py-2 text-center text-xs font-black text-blue-700 transition hover:bg-blue-600 hover:text-white">
                  경기 분석 보기
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "positive" | "negative" }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className={tone === "positive" ? "mt-2 text-2xl font-black text-emerald-600" : tone === "negative" ? "mt-2 text-2xl font-black text-red-600" : "mt-2 text-2xl font-black text-slate-950"}>{value}</p>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-black text-slate-950">{value}</span>
    </div>
  );
}
