import { formatCurrency, formatDate, formatSignedCurrency } from "@/lib/format";
import { getSettledCombinations } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Combination } from "@/lib/types";

export default function HistoryPage() {
  const grouped = getSettledCombinations().reduce<Record<string, Combination[]>>((acc, combination) => {
    acc[combination.date] = acc[combination.date] ?? [];
    acc[combination.date].push(combination);
    return acc;
  }, {});

  return (
    <section className="container-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent-green">Combination History</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">기록실</h1>
        <p className="mt-3 text-slate-400">과거 단일 픽이 아니라 AI별 조합 티켓, 배당률, 수익/손실을 날짜별로 확인합니다.</p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([date, combinations]) => (
          <section key={date}>
            <h2 className="mb-3 text-lg font-bold text-white">{formatDate(`${date} 00:00`)}</h2>
            <div className="grid gap-4">
              {combinations.map((combination) => (
                <article key={combination.id} className="panel p-5">
                  <div className="grid gap-4 lg:grid-cols-[0.8fr_1.4fr_0.7fr_auto] lg:items-start">
                    <div>
                      <p className="text-xl font-black text-white">{combination.aiName}</p>
                      <p className="mt-1 text-sm font-semibold text-accent-green">
                        {combination.style} · 선택 경기 수 {combination.selections.length}폴더
                      </p>
                    </div>

                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">조합</p>
                      <div className="grid gap-2">
                        {combination.selections.map((selection, index) => (
                          <div key={`${combination.id}-${selection.match}-${index}`} className="rounded-md border border-white/10 bg-black/20 p-3">
                            <p className="font-semibold text-white">{selection.prediction}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {selection.league} · {selection.match} · 배당 {selection.odds.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                      <Info label="오늘의 조합 배당" value={combination.totalOdds.toFixed(2)} />
                      <Info label="투자금" value={formatCurrency(combination.stake)} />
                      <Info label="예상 수익" value={formatCurrency(combination.potentialReturn)} />
                    </div>

                    <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
                      <StatusBadge status={combination.status} />
                      <span className={combination.profit >= 0 ? "font-bold text-emerald-300" : "font-bold text-red-300"}>
                        {formatSignedCurrency(combination.profit)}
                      </span>
                      <span className="text-sm text-slate-500">{combination.result}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-100">{value}</p>
    </div>
  );
}
