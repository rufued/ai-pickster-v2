"use client";

import clsx from "clsx";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import type { Game, GameStatus, SportName } from "@/data/games";
import { getAiName } from "@/services/scorehub";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { TeamLogo } from "@/components/sports/SportsBrand";
import { AiBrandIcon } from "@/components/ai/AiBrandIcon";
import { AdPlaceholder } from "@/components/ads/AdSlot";
import { useI18n } from "@/components/i18n/I18nProvider";

const sports: Array<"전체" | SportName> = ["전체", "축구", "야구", "농구", "E스포츠"];
const statuses: Array<"all" | GameStatus> = ["all", "scheduled", "live", "final"];

export function GameOddsBoard({ games, recentSportCounts, activityDays }: { games: Game[]; recentSportCounts: Record<string, number>; activityDays: number }) {
  const { t } = useI18n();
  const [sport, setSport] = useState<(typeof sports)[number]>("전체");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");

  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        const gameDate = game.startTime.slice(0, 10);
        return (sport === "전체" || game.sport === sport) && (!date || gameDate === date) && (status === "all" || game.status === status);
      }),
    [date, games, sport, status],
  );

  const grouped = useMemo(() => {
    return filteredGames.reduce<Record<string, Game[]>>((acc, game) => {
      acc[game.league] = [...(acc[game.league] ?? []), game];
      return acc;
    }, {});
  }, [filteredGames]);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sports.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSport(item)}
              className={clsx(
                "shrink-0 rounded-md border px-3 py-2 text-sm font-black transition",
                sport === item ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50",
              )}
            >
              <span>{sportLabel(item, t)}</span>
              {item !== "?꾩껜" && (recentSportCounts[item] ?? 0) === 0 ? <span className={clsx("ms-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-black", sport === item ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>{t("games.offSeason")}</span> : null}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] font-bold text-slate-500">{t("games.seasonBasis", { days: activityDays })}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[180px_1fr]">
          <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
            {t("games.date")}
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-400" />
          </label>
          <div className="grid gap-1 text-xs font-black uppercase text-slate-500">
            {t("games.status")}
            <div className="flex flex-wrap gap-2">
              {statuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatus(item)}
                  className={clsx("h-10 rounded-md border px-3 text-sm font-black", status === item ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-50 text-slate-700")}
                >
                  {statusLabel(item, t)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {Object.entries(grouped).map(([league, leagueGames], index) => (
        <Fragment key={league}>
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-950">{league}</h2>
            <span className="text-xs font-black text-slate-500">{t("common.gamesCount", { count: leagueGames.length })}</span>
          </div>
          <div className="grid gap-3">
            {leagueGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
        {index === 0 ? <AdPlaceholder placement="games_inline" className="min-h-24" /> : null}
        </Fragment>
      ))}

      {filteredGames.length === 0 ? <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm font-bold text-slate-500">{t("games.noMatch")}</div> : null}

      <aside className="rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-sm font-bold text-slate-600">
        {t("games.requestLeague")} <Link href="/community" className="font-black text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900">{t("games.contactCommunity")}</Link>
      </aside>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const { t } = useI18n();
  const homePicks = game.predictions.filter((prediction) => pickSide(prediction.pick, game) === "home");
  const drawPicks = game.predictions.filter((prediction) => pickSide(prediction.pick, game) === "draw");
  const awayPicks = game.predictions.filter((prediction) => pickSide(prediction.pick, game) === "away");

  return (
    <article className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{game.league}</span>
          <LocalDateTime value={game.startTime} mode="mobile" />
          <span>{sportLabel(game.sport, t)}</span>
        </div>
        <span className={clsx("rounded-full px-2.5 py-1 text-xs font-black", game.status === "live" ? "bg-amber-50 text-amber-700" : game.status === "final" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700")}>
          {statusLabel(game.status, t)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_54px_minmax(0,1fr)] md:items-stretch">
        <TeamOddsCard team={game.homeTeam} odds={game.odds.home} picks={homePicks.map((pick) => pick.aiId)} side="home" />
        <div className="flex items-center justify-center rounded-md bg-slate-50 px-3 py-4 text-sm font-black text-slate-500">VS</div>
        <TeamOddsCard team={game.awayTeam} odds={game.odds.away} picks={awayPicks.map((pick) => pick.aiId)} side="away" />
      </div>

      {game.sport === "축구" ? (
        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-black uppercase text-slate-500">1X2 odds</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <CompactOdd label={t("markets.homeWin")} value={game.odds.home} active={homePicks.length > 0} />
            <CompactOdd label={t("markets.draw")} value={game.odds.draw} active={drawPicks.length > 0} />
            <CompactOdd label={t("markets.awayWin")} value={game.odds.away} active={awayPicks.length > 0} />
          </div>
        </div>
      ) : null}

      <details className="mt-3 rounded-md border border-slate-200 bg-white">
        <summary className="cursor-pointer px-3 py-2 text-sm font-black text-slate-700">{t("markets.showMore")}</summary>
        <div className="grid gap-2 border-t border-slate-100 p-3 sm:grid-cols-2">
          <CompactOdd label={t("markets.spread")} value={game.odds.handicap} />
          <CompactOdd label={t("markets.total")} value={game.odds.overUnder} />
        </div>
      </details>

      <Link href={`/games/${game.id}`} className="mt-3 inline-flex rounded-md border border-blue-200 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-600 hover:text-white">
        {t("games.detail")}
      </Link>
    </article>
  );
}

function TeamOddsCard({ team, odds, picks, side }: { team: string; odds?: number; picks: string[]; side: "home" | "away" }) {
  const { t } = useI18n();
  const hasPick = picks.length > 0;
  return (
    <div className={clsx("rounded-lg border p-4", hasPick ? "border-blue-200 bg-blue-50/60" : "border-slate-200 bg-white")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <TeamLogo team={team} size="lg" />
          <div className="min-w-0">
            <p className="whitespace-normal text-base font-black leading-snug text-slate-950 [overflow-wrap:anywhere] sm:text-lg">{team}</p>
            <p className="text-xs font-bold uppercase text-slate-500">{t(`games.${side}`)}</p>
          </div>
        </div>
        <span className="rounded-md bg-white px-3 py-2 text-lg font-black text-slate-950 shadow-sm">{odds?.toFixed(2) ?? "-"}</span>
      </div>
      {hasPick ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {picks.map((aiId) => (
            <span key={aiId} className="inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[11px] font-black text-blue-700 shadow-sm"><AiBrandIcon ai={aiId} size="xs" />{getAiName(aiId)} PICK</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CompactOdd({ label, value, active }: { label: string; value?: number | string; active?: boolean }) {
  return <div className={clsx("rounded-md px-3 py-2 text-sm", active ? "bg-blue-100 text-blue-800" : "bg-white text-slate-700")}><span className="font-bold text-slate-500">{label}</span><span className="ml-2 font-black">{typeof value === "number" ? value.toFixed(2) : value ?? "-"}</span></div>;
}

function statusLabel(status: "all" | GameStatus, t: (key: string) => string) {
  return status === "all" ? t("common.all") : status === "scheduled" ? t("common.scheduled") : status === "live" ? t("common.live") : t("common.finished");
}

function sportLabel(sport: string, t: (key: string) => string) {
  if (sport === "전체") return t("common.all");
  if (sport === "축구") return t("sports.soccer");
  if (sport === "야구") return t("sports.baseball");
  if (sport === "농구") return t("sports.basketball");
  if (sport.toLowerCase().includes("스포츠")) return t("sports.esports");
  return sport;
}

function pickSide(pick: string, game: Game): "home" | "draw" | "away" | "other" {
  const lower = pick.toLowerCase();
  if (lower.includes("draw")) return "draw";
  if (lower.includes(game.homeTeam.toLowerCase().split(" ")[0])) return "home";
  if (lower.includes(game.awayTeam.toLowerCase().split(" ")[0])) return "away";
  return "other";
}
