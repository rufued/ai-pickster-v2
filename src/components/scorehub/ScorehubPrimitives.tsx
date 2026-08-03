import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import { AiBrandIcon } from "@/components/ai/AiBrandIcon";
import { getAi, getAiName } from "@/services/scorehub";
import type { AiBet } from "@/data/bets";
import { useI18n } from "@/components/i18n/I18nProvider";

export const currency = (value: number) =>
  `${value < 0 ? "-" : ""}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export const signedCurrency = (value: number) => `${value > 0 ? "+" : ""}${currency(value)}`;
export const percent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export function DashboardShell({ title, eyebrow, description, children }: { title: string; eyebrow?: string; description?: string; children: ReactNode }) {
  return (
    <div className="min-w-0 max-w-full overflow-x-clip bg-slate-50">
      <div className="container-shell min-w-0 space-y-5 py-5">
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

export function Metric({ label, value, tone = "neutral" }: { label: string; value: ReactNode; tone?: "neutral" | "positive" | "negative" }) {
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
      <AiBrandIcon ai={aiId} size={compact ? "sm" : "md"} />
      <span className="truncate">{ai?.name ?? aiId}</span>
    </span>
  );
}

export function StatusBadge({ status }: { status: AiBet["status"] }) {
  const { t } = useI18n();
  const label = status === "scheduled" ? t("common.scheduled") : status === "live" ? t("common.live") : status === "won" ? t("common.won") : status === "lost" ? t("common.lost") : t("common.void");
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

export function shortDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}.${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function timeUntil(value: string, t?: (key: string, values?: Record<string, string | number>) => string) {
  const diff = new Date(value).getTime() - Date.now();
  if (Number.isNaN(diff)) return "-";
  if (diff <= 0) return t ? t("time.inProgress") : "In progress";
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return t ? t("time.remaining", { hours, minutes }) : `${hours}h ${minutes}m remaining`;
}

export function aiNames(ids: string[]) {
  return ids.map(getAiName).join(", ");
}
