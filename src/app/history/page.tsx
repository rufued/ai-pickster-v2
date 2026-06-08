import { predictionHistory } from "@/lib/data";

export default function HistoryPage() {
  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-blue-700">AI 기록실</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">과거 예측 기록</h1>
        <p className="mt-2 text-sm text-slate-600">날짜, 종목, AI, 리그 기준으로 확장 가능한 기록 테이블 구조입니다.</p>
      </div>

      <div className="mb-4 grid gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-4">
        {["날짜 전체", "종목 전체", "AI 전체", "리그 전체"].map((label) => (
          <button key={label} type="button" className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-bold text-slate-600">
            {label}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">날짜</th>
                <th className="px-4 py-3">종목</th>
                <th className="px-4 py-3">리그</th>
                <th className="px-4 py-3">경기</th>
                <th className="px-4 py-3">AI</th>
                <th className="px-4 py-3">예측</th>
                <th className="px-4 py-3">결과</th>
                <th className="px-4 py-3">적중</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {predictionHistory.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-600">{record.date}</td>
                  <td className="px-4 py-4 font-bold text-slate-800">{record.sport}</td>
                  <td className="px-4 py-4 text-slate-600">{record.league}</td>
                  <td className="px-4 py-4 font-bold text-slate-950">{record.match}</td>
                  <td className="px-4 py-4 text-blue-700 font-black">{record.aiName}</td>
                  <td className="px-4 py-4">{record.prediction} · {record.confidence}%</td>
                  <td className="px-4 py-4 text-slate-600">{record.result}</td>
                  <td className="px-4 py-4">
                    <span className={record.hit ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700" : "rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-700"}>
                      {record.hit ? "적중" : "미적중"}
                    </span>
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
