import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { ComingSoonBadge } from "@/components/ai/AiIdentity";
import { isAiComingSoon } from "@/lib/aiConfig";
import { getAi, getAiColor, getAiName } from "@/services/scorehub";
import type { AiBet } from "@/data/bets";

export const currency = (value: number) =>
  `${value < 0 ? "-" : ""}${Math.abs(value).toLocaleString("ko-KR", { maximumFractionDigits: 0 })} SHC`;

export const signedCurrency = (value: number) => `${value > 0 ? "+" : ""}${currency(value)}`;
export const percent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export function DashboardShell({ title, eyebrow, description, children }: { title: string; eyebrow?: string; description?: string; children: ReactNode }) {
  return (
    <div className="bg-slate-50">
      <div className="container-shell space-y-5 py-5">
        <header className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          {eyebrow ? <p className="text-xs font-black uppercase text-blue-700">{eyebrow}</p> : null}
          <h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-600">{description}</p> : null}
        </header>
        {children}
      </div>
    </div>
  );
}

export function Section({ title, action, href, children }: { title: string; action?: string; href?: string; children: ReactNode }) {
  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <h2 className="text-base font-black text-slate-950">{title}</h2>
        {action && href ? (
          <Link href={href} className="text-xs font-black text-blue-700 hover:text-blue-900">
            {action}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function Metric({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "positive" | "negative" }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className={clsx("mt-2 text-xl font-black", tone === "positive" ? "text-emerald-600" : tone === "negative" ? "text-red-600" : "text-slate-950")}>{value}</p>
    </article>
  );
}

export function AiPill({ aiId, compact = false }: { aiId: string; compact?: boolean }) {
  const ai = getAi(aiId);
  return (
    <span className="inline-flex min-w-0 items-center gap-2 font-black text-slate-950">
      <span className={clsx("inline-flex shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white", compact ? "h-6 w-6" : "h-8 w-8")} style={{ backgroundColor: getAiColor(aiId) }}>
        {ai?.initials ?? aiId.slice(0, 2).toUpperCase()}
      </span>
      <span className="truncate">{ai?.name ?? aiId}</span>
      {isAiComingSoon(aiId) ? <ComingSoonBadge /> : null}
    </span>
  );
}

export function StatusBadge({ status }: { status: AiBet["status"] }) {
  const label = status === "scheduled" ? "예정" : status === "live" ? "진행 중" : status === "won" ? "적중" : status === "lost" ? "미적중" : "무효";
  const tone =
    status === "won"
      ? "bg-emerald-50 text-emerald-700"
      : status === "lost"
        ? "bg-red-50 text-red-700"
        : status === "live"
          ? "bg-amber-50 text-amber-700"
          : "bg-blue-50 text-blue-700";
  return <span className={clsx("rounded-full px-2.5 py-1 text-xs font-black", tone)}>{label}</span>;
}

export function BetCard({ bet }: { bet: AiBet }) {
  const firstLeg = bet.legs[0];
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" style={{ borderLeftColor: getAiColor(bet.aiId), borderLeftWidth: 4 }}>
      <div className="flex items-start justify-between gap-3">
        <AiPill aiId={bet.aiId} />
        <StatusBadge status={bet.status} />
      </div>
      <div className="mt-4">
        <p className="text-sm font-bold text-slate-500">{bet.kind === "combo" ? `${bet.legs.length}폴더 조합` : "단폴더"}</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">{firstLeg ? `${firstLeg.homeTeam} vs ${firstLeg.awayTeam}` : "-"}</h3>
        <p className="mt-2 text-sm font-semibold text-blue-700">{firstLeg?.selection}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Mini label="총 배당" value={bet.totalOdds.toFixed(2)} />
        <Mini label="배팅금액" value={currency(bet.stake)} />
        <Mini label="예상수익" value={currency(bet.potentialProfit)} />
        <Mini label="등록시간" value={shortDateTime(bet.registeredAt)} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-slate-500">시작 {timeUntil(bet.startsAt)}</p>
        <Link href={`/picks/${bet.id}`} className="rounded-md border border-blue-200 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-600 hover:text-white">
          상세
        </Link>
      </div>
    </article>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
      <p className="mt-0.5 truncate font-black text-slate-900">{value}</p>
    </div>
  );
}

export function shortDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}.${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function timeUntil(value: string) {
  const diff = new Date(value).getTime() - Date.now();
  if (Number.isNaN(diff)) return "-";
  if (diff <= 0) return "진행 중";
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}시간 ${minutes}분 후`;
}

export function aiNames(ids: string[]) {
  return ids.map(getAiName).join(", ");
}
