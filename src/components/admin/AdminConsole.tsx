"use client";
import { useEffect, useMemo, useState } from "react";

type Game = Record<string, string | number | null>;
type HumanBetLeg = { gameId: string; teams: string; pickLabel: string; commenceTime: string | null };
type HumanBet = { id: string; kind: "single" | "parlay"; uiStatus: string; stake: number; totalOdds: number; createdAt: string; cancellable: boolean; legs: HumanBetLeg[] };
type Data = { games: Game[]; counts: Record<string, number>; runs: Array<Record<string, unknown>>; providers: Record<string, unknown>; humanBets: HumanBet[]; cancelSchemaReady: boolean; migrationRequired?: boolean };
const choices = [
  ["home_win", "홈승", "home_odds"], ["away_win", "원정승", "away_odds"], ["draw", "무승부", "draw_odds"], ["home_spread", "홈 핸디캡", "home_spread_odds"], ["away_spread", "원정 핸디캡", "away_spread_odds"], ["over", "오버", "over_odds"], ["under", "언더", "under_odds"],
];

const statusLabel: Record<string, string> = { pending: "대기중", won: "적중", lost: "실패", void: "적중 무효", cancelled: "취소됨" };
const statusTone: Record<string, string> = { pending: "bg-blue-50 text-blue-700", won: "bg-emerald-50 text-emerald-700", lost: "bg-red-50 text-red-700", void: "bg-slate-100 text-slate-600", cancelled: "bg-slate-100 text-slate-400" };

export function AdminConsole({ initialTab }: { initialTab: "picks" | "monitor" }) {
  const [data, setData] = useState<Data | null>(null); const [selected, setSelected] = useState<Record<string, string>>({}); const [stake, setStake] = useState(2000); const [confidence, setConfidence] = useState(70); const [message, setMessage] = useState(""); const [analysis, setAnalysis] = useState(""); const [cancellingId, setCancellingId] = useState("");
  const load = async () => { const response = await fetch("/api/admin/data", { cache: "no-store" }); if (response.ok) setData(await response.json()); };
  useEffect(() => { void load(); }, []);
  const legs = useMemo(() => Object.entries(selected).filter(([, value]) => value).map(([game_id, pick_type]) => ({ game_id, pick_type })), [selected]);
  if (!data) return <div className="rounded-xl border bg-white p-8 text-center font-bold text-slate-500">불러오는 중…</div>;

  async function cancelBet(bet: HumanBet) {
    if (!window.confirm(bet.kind === "parlay" ? "이 조합을 취소할까요? 취소 후 각 경기에 새로 픽을 등록할 수 있습니다." : "이 픽을 취소할까요? 취소 후 같은 경기에 새로 픽을 등록할 수 있습니다.")) return;
    setCancellingId(bet.id); setMessage("");
    const response = await fetch(bet.kind === "parlay" ? `/api/admin/parlays/${bet.id}/cancel` : `/api/admin/picks/${bet.id}/cancel`, { method: "POST" });
    const result = await response.json().catch(() => ({}));
    setCancellingId("");
    setMessage(response.ok ? "취소되었습니다." : (result.error ?? "취소하지 못했습니다."));
    if (response.ok) await load();
  }

  return <div className="space-y-4">
  {initialTab === "picks" ? <div className="space-y-4">
    <section className="rounded-xl border bg-white p-4"><div className="mb-4 flex flex-wrap items-end gap-3"><label className="text-xs font-black">베팅금<input type="number" min="200" max="10000" value={stake} onChange={(e)=>setStake(Number(e.target.value))} className="mt-1 block rounded border p-2" /></label><label className="text-xs font-black">확신도<input type="number" min="1" max="100" value={confidence} onChange={(e)=>setConfidence(Number(e.target.value))} className="mt-1 block rounded border p-2" /></label><label className="w-full text-xs font-black">선택 근거 설명 (선택)<textarea value={analysis} onChange={(e)=>setAnalysis(e.target.value)} maxLength={4000} rows={4} placeholder="이 픽 또는 조합을 선택한 이유를 입력하세요." className="mt-1 block w-full resize-y rounded border p-3 text-sm font-medium" /></label><button disabled={!legs.length} onClick={async()=>{setMessage("");const response=await fetch("/api/admin/picks",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({legs,stake,confidence,analysis})});const result=await response.json();setMessage(response.ok?`${result.type === "parlay" ? "조합" : "단일"} 베팅 저장 완료`:result.error);if(response.ok){setSelected({});setAnalysis("");await load();}}} className="rounded-lg bg-blue-600 px-5 py-2.5 font-black text-white disabled:opacity-40">{legs.length > 1 ? `${legs.length}경기 조합 제출` : "단일 픽 제출"}</button><span className="text-sm font-bold text-slate-500">{message}</span></div><div className="max-h-[600px] divide-y overflow-y-auto">{data.games.map((game)=><div key={String(game.id)} className="grid gap-2 py-3 md:grid-cols-[1fr_240px]"><div><p className="text-xs font-bold text-slate-400">{game.sport_label} · {new Date(String(game.commence_time)).toLocaleString()}</p><p className="font-black">{game.home_team} vs {game.away_team}</p></div><select value={selected[String(game.id)] ?? ""} onChange={(e)=>setSelected((value)=>({...value,[String(game.id)]:e.target.value}))} className="rounded-lg border p-2"><option value="">선택 안 함</option>{choices.filter((choice)=>game[choice[2]] != null).map((choice)=><option key={choice[0]} value={choice[0]}>{choice[1]} · {Number(game[choice[2]]).toFixed(2)}</option>)}</select></div>)}</div></section>
    <section className="rounded-xl border bg-white p-4">
      <h2 className="font-black">등록된 운영자 픽 · 조합</h2>
      {!data.cancelSchemaReady ? <p className="mt-2 text-sm font-bold text-amber-600">마이그레이션(20260804_admin_console_upgrades.sql) 실행 후 취소 기능이 활성화됩니다.</p> : null}
      <div className="mt-3 max-h-[500px] divide-y overflow-y-auto">
        {data.humanBets.length ? data.humanBets.map((bet) => <div key={`${bet.kind}-${bet.id}`} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400">{bet.kind === "parlay" ? `${bet.legs.length}경기 조합` : "단일 픽"} · {new Date(bet.createdAt).toLocaleString()}</p>
            {bet.legs.map((leg) => <p key={leg.gameId} className="truncate font-black">{leg.teams}{leg.pickLabel ? ` · ${leg.pickLabel}` : ""}</p>)}
            <p className="text-xs font-bold text-slate-500">베팅금 {bet.stake.toLocaleString()} · 배당 {bet.totalOdds.toFixed(2)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-black ${statusTone[bet.uiStatus] ?? "bg-slate-100 text-slate-600"}`}>{statusLabel[bet.uiStatus] ?? bet.uiStatus}</span>
            {bet.cancellable ? <button disabled={cancellingId === bet.id} onClick={() => cancelBet(bet)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-black text-red-600 hover:bg-red-50 disabled:opacity-40">{cancellingId === bet.id ? "취소 중…" : "취소"}</button> : null}
          </div>
        </div>) : <p className="py-6 text-center text-sm font-bold text-slate-500">등록된 운영자 픽이 없습니다.</p>}
      </div>
    </section>
  </div> : <Monitor data={data} reload={load} />}
  </div>;
}
function Monitor({ data, reload }: { data: Data; reload: () => Promise<void> }) { const [running,setRunning]=useState(""); const jobs=[["games","일반 경기 수집"],["esports","E스포츠 수집"],["picks","AI 픽 생성"],["settlement","정산"],["chat","채팅 생성"]]; return <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3">{Object.entries(data.counts).map(([key,value])=><div key={key} className="rounded-xl border bg-white p-4"><p className="text-xs font-black uppercase text-slate-400">{key}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}</div><section className="rounded-xl border bg-white p-4"><h2 className="font-black">데이터 공급자</h2><pre className="mt-3 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-emerald-300">{JSON.stringify(data.providers,null,2)}</pre></section><section className="rounded-xl border bg-white p-4"><h2 className="font-black">수동 실행</h2><div className="mt-3 flex flex-wrap gap-2">{jobs.map(([job,label])=><button key={job} disabled={Boolean(running)} onClick={async()=>{setRunning(job);await fetch('/api/admin/run',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({job})});setRunning('');await reload();}} className="rounded-lg border px-3 py-2 text-sm font-black disabled:opacity-40">{running===job?'실행 중…':label}</button>)}</div></section><section className="rounded-xl border bg-white p-4"><h2 className="font-black">최근 실행</h2>{data.migrationRequired?<p className="mt-2 text-sm font-bold text-amber-600">마이그레이션 실행 후 로그가 표시됩니다.</p>:<div className="mt-3 divide-y">{data.runs.map((run,index)=><div key={index} className="flex justify-between gap-3 py-2 text-sm"><span className="font-black">{String(run.job_name)}</span><span className={run.status==='success'?'text-emerald-600':'text-red-600'}>{String(run.status)} · {new Date(String(run.started_at)).toLocaleString()}</span></div>)}</div>}</section></div>; }
