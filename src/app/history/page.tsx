import { AiIdentity } from "@/components/ai/AiIdentity";
import { leaguePickHistory } from "@/lib/league";

export default function HistoryPage() {
  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-blue-700">픽 기록실</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">AI와 인간의 예측 기록</h1>
        <p className="mt-2 text-sm text-slate-600">모든 예측은 같은 형식으로 저장되고, 경기 종료 후 결과와 채점 상태가 자동 반영됩니다.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-3">
        {["전체", "AI", "인간"].map((label) => (
          <button key={label} type="button" className={label === "전체" ? "rounded-md bg-blue-600 px-3 py-2 text-left text-sm font-black text-white" : "rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold text-slate-600"}>
            {label}
          </button>
        ))}
      </div>

      <div className="panel hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">날짜</th>
                <th className="px-4 py-3">참가자</th>
                <th className="px-4 py-3">구분</th>
                <th className="px-4 py-3">경기</th>
                <th className="px-4 py-3">예측</th>
                <th className="px-4 py-3">결과</th>
                <th className="px-4 py-3">채점</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaguePickHistory.map((record) => {
                const pending = record.result === "대기중";
                return (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-slate-600">{record.date}</td>
                    <td className="px-4 py-4 font-black text-slate-950">
                      {record.kind === "AI" ? <AiIdentity name={record.participant} showBadge={false} nameClassName="text-sm" /> : record.participant}
                    </td>
                    <td className="px-4 py-4"><TypeBadge kind={record.kind} /></td>
                    <td className="px-4 py-4 font-bold text-slate-800">{record.match}</td>
                    <td className="px-4 py-4 font-black text-blue-700">{record.pick} · {record.confidence}%</td>
                    <td className="px-4 py-4 text-slate-600">{record.result}</td>
                    <td className="px-4 py-4"><ScoreBadge pending={pending} hit={record.hit} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {leaguePickHistory.map((record) => {
          const pending = record.result === "대기중";
          return (
            <article key={record.id} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-500">{record.date} · {record.sport}</p>
                  <div className="mt-1 font-black text-slate-950">
                    {record.kind === "AI" ? <AiIdentity name={record.participant} showBadge={false} nameClassName="text-base" /> : record.participant}
                  </div>
                </div>
                <ScoreBadge pending={pending} hit={record.hit} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-800">{record.match}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <Mini label="예측" value={`${record.pick} · ${record.confidence}%`} />
                <Mini label="결과" value={record.result} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}

function ScoreBadge({ pending, hit }: { pending: boolean; hit: boolean }) {
  return (
    <span className={pending ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" : hit ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-700"}>
      {pending ? "대기" : hit ? "적중" : "미적중"}
    </span>
  );
}

function TypeBadge({ kind }: { kind: "AI" | "인간" }) {
  return (
    <span className={kind === "AI" ? "rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700"}>
      {kind}
    </span>
  );
}
