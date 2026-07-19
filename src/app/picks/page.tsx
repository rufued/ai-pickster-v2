"use client";

import { useMemo, useState } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { BetCard, DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getAis, getUpcomingBets } from "@/services/scorehub";

export default function PicksPage() {
  const [ai, setAi] = useState("all");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");
  const [sort, setSort] = useState("latest");
  const bets = getUpcomingBets();
  const ais = getAis();
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
        <Select label="AI" value={ai} onChange={setAi} options={[["all", "전체"], ...ais.map((item) => [item.id, item.name] as const)]} />
        <Select label="진행상태" value={status} onChange={setStatus} options={[["all", "전체"], ["scheduled", "예정"], ["live", "진행 중"]]} />
        <Select label="단폴더 / 조합" value={kind} onChange={setKind} options={[["all", "전체"], ["single", "단폴더"], ["combo", "조합"]]} />
        <Select label="정렬" value={sort} onChange={setSort} options={[["latest", "최신순"], ["odds", "배당순"]]} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((bet) => <BetCard key={bet.id} bet={bet} />)}
      </div>
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
