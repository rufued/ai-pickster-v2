import { Trophy } from "lucide-react";
import { getRankedAis } from "@/lib/data";

export default function RankingPage() {
  const rankedAis = getRankedAis();

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-blue-700">AI 랭킹</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">AI별 예측 성적</h1>
        <p className="mt-2 text-sm text-slate-600">누적 적중률, 최근 30일 성적, 종목별 성적을 플랫폼 지표로 정리했습니다.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {rankedAis.map((ai, index) => (
          <article key={ai.id} className="panel p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-sm font-black text-blue-700">{index + 1}</span>
              <Trophy size={18} className={index === 0 ? "text-amber-500" : "text-slate-300"} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">{ai.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{ai.analysisStyle}</p>
            <p className="mt-4 text-3xl font-black text-blue-700">{ai.accuracy.toFixed(1)}%</p>
            <p className="text-xs font-bold text-slate-500">누적 적중률</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Metric label="30일" value={`${ai.recent30DayAccuracy}%`} />
              <Metric label="예측" value={`${ai.totalPicks}회`} />
              <Metric label="적중" value={`${ai.wins}회`} />
              <Metric label="미적중" value={`${ai.losses}회`} />
            </div>
          </article>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-base font-black text-slate-950">종목별 성적</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">AI</th>
                <th className="px-4 py-3">등급</th>
                <th className="px-4 py-3">최근 30일</th>
                <th className="px-4 py-3">종목별 강점</th>
                <th className="px-4 py-3">최근 10개</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedAis.map((ai) => (
                <tr key={ai.id}>
                  <td className="px-4 py-4 font-black text-slate-950">{ai.name}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{ai.reliabilityGrade}</span></td>
                  <td className="px-4 py-4 font-bold text-slate-700">{ai.recent30DayWins}승 {ai.recent30DayLosses}패 · {ai.recent30DayAccuracy}%</td>
                  <td className="px-4 py-4 text-slate-600">{ai.sportStats?.map((stat) => `${stat.sport} ${stat.accuracy}%`).join(" / ")}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      {ai.recent10Results.map((result, index) => (
                        <span key={`${ai.id}-${index}`} className={result === "적중" ? "h-6 w-6 rounded bg-emerald-50 text-center text-xs font-black leading-6 text-emerald-700" : "h-6 w-6 rounded bg-rose-50 text-center text-xs font-black leading-6 text-rose-700"}>
                          {result === "적중" ? "O" : "X"}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}
