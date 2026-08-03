"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

type LogoTone = {
  label: string;
  bg: string;
  fg: string;
  ring: string;
};

const logoCache = new Map<string, string | null>();

const leagueLogos: Record<string, LogoTone> = {
  MLB: { label: "MLB", bg: "#0A3161", fg: "#FFFFFF", ring: "#A7BDE3" },
  KBO: { label: "KBO", bg: "#002F6C", fg: "#FFFFFF", ring: "#9CB8E5" },
  NBA: { label: "NBA", bg: "#1D428A", fg: "#FFFFFF", ring: "#9AB8F7" },
  EPL: { label: "PL", bg: "#3D195B", fg: "#FFFFFF", ring: "#C8AAE6" },
  "K리그1": { label: "K1", bg: "#E31B23", fg: "#FFFFFF", ring: "#F2A0A4" },
  LCK: { label: "LCK", bg: "#111827", fg: "#D1D5DB", ring: "#9CA3AF" },
};

export function TeamLogo({ team, size = "md" }: { team: string; size?: "sm" | "md" | "lg" }) {
  const fallback = fallbackLogo(team);
  const [logoUrl, setLogoUrl] = useState<string | null | undefined>(() => logoCache.get(team));
  const sizeClass = size === "sm" ? "h-6 w-6 text-[9px]" : size === "lg" ? "h-9 w-9 text-[11px]" : "h-8 w-8 text-[10px]";

  useEffect(() => {
    if (logoCache.has(team)) {
      setLogoUrl(logoCache.get(team));
      return;
    }

    let active = true;
    fetch(`/api/team-logo?name=${encodeURIComponent(team)}`)
      .then((response) => response.json())
      .then((data) => {
        const url = typeof data.logo === "string" ? data.logo : null;
        logoCache.set(team, url);
        if (active) setLogoUrl(url);
      })
      .catch(() => {
        logoCache.set(team, null);
        if (active) setLogoUrl(null);
      });

    return () => { active = false; };
  }, [team]);

  return (
    <span
      className={clsx("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border font-black leading-none shadow-sm", sizeClass)}
      style={{ backgroundColor: fallback.bg, borderColor: fallback.ring, color: fallback.fg }}
      aria-label={`${team} logo`}
      title={team}
    >
      {logoUrl ? <img src={logoUrl} alt="" className="h-full w-full object-contain" onError={() => { logoCache.set(team, null); setLogoUrl(null); }} /> : fallback.label} {/* eslint-disable-line @next/next/no-img-element */}
    </span>
  );
}

export function TeamName({ team, size = "md", className }: { team: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span className={clsx("flex min-w-0 max-w-full items-center gap-2", className)}>
      <TeamLogo team={team} size={size === "lg" ? "lg" : size === "sm" ? "sm" : "md"} />
      <span className="min-w-0 whitespace-normal [overflow-wrap:anywhere]">{team}</span>
    </span>
  );
}

export function TeamMatchup({
  homeTeam,
  awayTeam,
  compact = false,
  selectedSide,
  className,
}: {
  homeTeam: string;
  awayTeam: string;
  compact?: boolean;
  selectedSide?: "home" | "draw" | "away" | "total" | "handicap";
  className?: string;
}) {
  const { t } = useI18n();
  const selectedClass = "rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-2 text-emerald-900 ring-1 ring-emerald-100";
  return (
    <span className={clsx("block w-full min-w-0 max-w-full", className)}>
      {selectedSide === "draw" ? <span className="mb-2 inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-800">{t("markets.draw")}</span> : null}
      <span className="flex w-full min-w-0 max-w-full flex-col items-stretch gap-1.5 leading-snug sm:flex-row sm:items-center sm:gap-2">
        <TeamName team={homeTeam} size={compact ? "sm" : "md"} className={clsx("w-full min-w-0 sm:flex-1", selectedSide === "home" && selectedClass)} />
        <span className="shrink-0 self-center text-[10px] font-black text-slate-400 sm:text-xs">VS</span>
        <TeamName team={awayTeam} size={compact ? "sm" : "md"} className={clsx("w-full min-w-0 sm:flex-1", selectedSide === "away" && selectedClass)} />
      </span>
    </span>
  );
}

export function LeagueLogo({ league, size = "md" }: { league: string; size?: "sm" | "md" }) {
  const logo = leagueLogos[league] ?? fallbackLogo(league);
  const sizeClass = size === "sm" ? "h-5 min-w-5 px-1 text-[8px]" : "h-6 min-w-6 px-1.5 text-[9px]";

  return (
    <span
      className={clsx("inline-flex shrink-0 items-center justify-center rounded-md border font-black leading-none", sizeClass)}
      style={{ backgroundColor: logo.bg, borderColor: logo.ring, color: logo.fg }}
      aria-label={`${league} logo`}
      title={league}
    >
      {logo.label}
    </span>
  );
}

export function LeagueBadge({ league, className }: { league: string; className?: string }) {
  return (
    <span className={clsx("inline-flex min-w-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-black text-slate-700", className)}>
      <LeagueLogo league={league} size="sm" />
      <span className="truncate">{league === "EPL" ? "Premier League" : league}</span>
    </span>
  );
}

function fallbackLogo(name: string): LogoTone {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return {
    label: initials || "TM",
    bg: "#E2E8F0",
    fg: "#0F172A",
    ring: "#CBD5E1",
  };
}
