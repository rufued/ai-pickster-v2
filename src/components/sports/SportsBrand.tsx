"use client";

import clsx from "clsx";

type LogoTone = {
  label: string;
  bg: string;
  fg: string;
  ring: string;
};

const teamLogos: Record<string, LogoTone> = {
  "LA Dodgers": { label: "LA", bg: "#005A9C", fg: "#FFFFFF", ring: "#A5C8FF" },
  "San Diego Padres": { label: "SD", bg: "#2F241D", fg: "#FFC425", ring: "#D6B276" },
  "LG 트윈스": { label: "LG", bg: "#C30452", fg: "#FFFFFF", ring: "#F3A0BD" },
  "KIA 타이거즈": { label: "KIA", bg: "#EA0029", fg: "#FFFFFF", ring: "#F7A4B3" },
  "LA Lakers": { label: "LAL", bg: "#552583", fg: "#FDB927", ring: "#D7B4FF" },
  "Golden State Warriors": { label: "GS", bg: "#1D428A", fg: "#FFC72C", ring: "#9AB8F7" },
  "FC 서울": { label: "SEO", bg: "#B5192A", fg: "#FFFFFF", ring: "#EEA0AA" },
  "전북 현대": { label: "JEO", bg: "#007A3D", fg: "#FFFFFF", ring: "#91D6B3" },
  T1: { label: "T1", bg: "#E4002B", fg: "#FFFFFF", ring: "#F59AAA" },
  "Gen.G": { label: "GEN", bg: "#AA8A00", fg: "#111827", ring: "#EEDB79" },
  "한화 이글스": { label: "HAN", bg: "#F37321", fg: "#111827", ring: "#F7C094" },
  "롯데 자이언츠": { label: "LOT", bg: "#002955", fg: "#FFFFFF", ring: "#8CB3E8" },
  Arsenal: { label: "ARS", bg: "#EF0107", fg: "#FFFFFF", ring: "#F7A1A4" },
  Chelsea: { label: "CHE", bg: "#034694", fg: "#FFFFFF", ring: "#97B8EE" },
  "Boston Celtics": { label: "BOS", bg: "#007A33", fg: "#FFFFFF", ring: "#93D3AE" },
  "New York Knicks": { label: "NYK", bg: "#006BB6", fg: "#F58426", ring: "#9ACAF0" },
};

const leagueLogos: Record<string, LogoTone> = {
  MLB: { label: "MLB", bg: "#0A3161", fg: "#FFFFFF", ring: "#A7BDE3" },
  KBO: { label: "KBO", bg: "#002F6C", fg: "#FFFFFF", ring: "#9CB8E5" },
  NBA: { label: "NBA", bg: "#1D428A", fg: "#FFFFFF", ring: "#9AB8F7" },
  EPL: { label: "PL", bg: "#3D195B", fg: "#FFFFFF", ring: "#C8AAE6" },
  "K리그1": { label: "K1", bg: "#E31B23", fg: "#FFFFFF", ring: "#F2A0A4" },
  LCK: { label: "LCK", bg: "#111827", fg: "#D1D5DB", ring: "#9CA3AF" },
};

export function TeamLogo({ team, size = "md" }: { team: string; size?: "sm" | "md" | "lg" }) {
  const logo = teamLogos[team] ?? fallbackLogo(team);
  const sizeClass = size === "sm" ? "h-6 w-6 text-[9px]" : size === "lg" ? "h-9 w-9 text-[11px]" : "h-8 w-8 text-[10px]";

  return (
    <span
      className={clsx("inline-flex shrink-0 items-center justify-center rounded-full border font-black leading-none shadow-sm", sizeClass)}
      style={{ backgroundColor: logo.bg, borderColor: logo.ring, color: logo.fg }}
      aria-label={`${team} logo`}
      title={team}
    >
      {logo.label}
    </span>
  );
}

export function TeamName({ team, size = "md", className }: { team: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span className={clsx("inline-flex min-w-0 items-center gap-2", className)}>
      <TeamLogo team={team} size={size === "lg" ? "lg" : size === "sm" ? "sm" : "md"} />
      <span className="min-w-0 truncate">{team}</span>
    </span>
  );
}

export function TeamMatchup({ homeTeam, awayTeam, compact = false, className }: { homeTeam: string; awayTeam: string; compact?: boolean; className?: string }) {
  return (
    <span className={clsx("flex min-w-0 items-center gap-2", className)}>
      <TeamName team={homeTeam} size={compact ? "sm" : "md"} className="min-w-0" />
      <span className="shrink-0 text-xs font-black text-slate-400">VS</span>
      <TeamName team={awayTeam} size={compact ? "sm" : "md"} className="min-w-0" />
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
