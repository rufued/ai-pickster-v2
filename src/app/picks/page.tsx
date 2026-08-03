"use client";

import { useEffect, useMemo, useState } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { BetCard, DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import type { LiveData } from "@/lib/live-data";

export default function PicksPage() {
  const [ai, setAi] = useState("all");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");
  const [sort, setSort] = useState("latest");
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  useEffect(() => {
    fetch("/api/live-data", { cache: "no-store" }).then((response) => response.json()).then(setLiveData);
  }, []);
  const bets = useMemo(() => (liveData?.bets ?? []).filter((bet) => bet.status === "scheduled" || bet.status === "live"), [liveData]);
  const ais = liveData?.ais ?? [];
  const rows = useMemo(() => {
    return [...bets]
      .filter((bet) => ai === "all" || bet.aiId === ai)
      .filter((bet) => status === "all" || bet.status === status)
      .filter((bet) => kind === "all" || bet.kind === kind)
      .sort((a, b) => (sort === "odds" ? b.totalOdds - a.totalOdds : b.registeredAt.localeCompare(a.registeredAt)));
  }, [ai, bets, kind, sort, status]);

  return (
    <DashboardShell title="AI 픽 조합" eyebrow="Upcoming virtual bets" description="예정된 AI 배팅 조합과 단폴더 픽을 한 곳에서 비교합니다.">
      <AdSlot placement="picks_top" />
      <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-4">
        <Select label="AI" value={ai} onChange={setAi} options={[["all", "전체"], ...ais.map((item) => [item.id, item.total_picks === 0 ? `${item.name} · 준비중` : item.name] as const)]} />
        <Select label="진행상태" value={status} onChange={setStatus} options={[["all", "전체"], ["scheduled", "예정"], ["live", "진행 중"]]} />
        <Select label="단폴더 / 조합" value={kind} onChange={setKind} options={[["all", "전체"], ["single", "단폴더"], ["combo", "조합"]]} />
        <Select label="정렬" value={sort} onChange={setSort} options={[["latest", "최신순"], ["odds", "배당순"]]} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((bet) => <BetCard key={bet.id} bet={bet} />)}
      </div>
      {liveData && rows.length === 0 ? <div className="panel p-8 text-center text-sm font-bold text-slate-500">조건에 맞는 실제 픽 데이터가 없습니다.</div> : null}
      {!liveData ? <div className="panel p-8 text-center text-sm font-bold text-slate-500">실시간 픽을 불러오는 중입니다.</div> : null}
    </DashboardShell>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return (
    <label className="grid gap-1 text-xs font-black text-slate-500">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-400">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}
