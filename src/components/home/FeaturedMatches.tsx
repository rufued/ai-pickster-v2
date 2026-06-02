"use client";

import { Dumbbell, Gamepad2 } from "lucide-react";
import type { FeaturedMatch, Sport } from "@/lib/types";
import { formatTime } from "@/lib/format";

type FeaturedMatchesProps = {
  matches: FeaturedMatch[];
  contained?: boolean;
};

const sportIcon: Record<Sport, string> = {
  축구: "⚽",
  야구: "⚾",
  농구: "🏀",
  테니스: "🎾",
  "Formula 1": "🏁",
  아이스하키: "🏒",
  e스포츠: "🎮",
};

export function FeaturedMatches({ matches, contained = true }: FeaturedMatchesProps) {
  const content = (
    <>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent-blue">Match Day</p>
          <h2 className="mt-2 text-2xl font-black text-white">오늘 주요 경기</h2>
        </div>
        <Dumbbell className="hidden text-slate-600 sm:block" size={24} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {matches.map((match) => (
          <article key={match.id} className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl" aria-hidden>
                {sportIcon[match.sport]}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
                {match.league}
              </span>
            </div>
            <h3 className="mt-4 min-h-12 text-lg font-black leading-snug text-white">{match.match}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
              <Gamepad2 size={16} className="text-accent-green" />
              <span>{formatTime(match.startTime)} 시작</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );

  if (!contained) {
    return <section>{content}</section>;
  }

  return <section className="container-shell pb-12">{content}</section>;
}
