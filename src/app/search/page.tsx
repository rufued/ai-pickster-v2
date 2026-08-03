import Link from "next/link";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { LeagueBadge, TeamLogo } from "@/components/sports/SportsBrand";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { aiConfigs } from "@/lib/aiConfig";
import { gameDetailHref } from "@/lib/route-id";
import { searchGames } from "@/lib/search-data";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const t = await getTranslations();
  const query = (await searchParams).q?.trim() ?? "";
  const ai = query ? aiConfigs.find((item) => item.name.toLocaleLowerCase() === query.toLocaleLowerCase()) : undefined;
  if (ai) redirect(`/ai/${ai.id}`);
  const games = query ? await searchGames(query) : [];

  return <DashboardShell eyebrow="Search" title={t("search.title")} description={query ? t("search.summary", { query, count: games.length }) : t("search.description")}><form action="/search" method="get" className="flex w-full gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"><input name="q" type="search" required defaultValue={query} placeholder={t("nav.search")} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-400" /><button className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white"><Search size={17} /><span className="hidden sm:inline">{t("search.button")}</span></button></form>{games.length ? <div className="space-y-3">{games.map((game) => <Link key={game.id} href={gameDetailHref(game.id)} className="grid min-w-0 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"><div className="min-w-0"><LeagueBadge league={game.sportLabel} /><div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center"><Team name={game.homeTeam} odds={game.homeOdds} /><span className="text-center text-xs font-black text-slate-400">VS</span><Team name={game.awayTeam} odds={game.awayOdds} align="end" /></div>{game.drawOdds ? <p className="mt-2 text-center text-xs font-bold text-slate-400">{t("markets.draw")} {game.drawOdds.toFixed(2)}</p> : null}</div><div className="text-start sm:text-end"><p className="text-xs font-black text-blue-700"><LocalDateTime value={game.commenceTime} /></p><p className="mt-1 text-xs font-bold text-slate-400">{game.status === "finished" ? t("common.finished") : t("common.scheduled")}</p></div></Link>)}</div> : query ? <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-bold text-slate-500">{t("search.empty")}</div> : null}</DashboardShell>;
}

function Team({ name, odds, align = "start" }: { name: string; odds?: number; align?: "start" | "end" }) {
  return <div className={`flex min-w-0 items-center gap-2 ${align === "end" ? "sm:flex-row-reverse sm:text-end" : ""}`}><TeamLogo team={name} size="sm" /><span className="min-w-0 break-words text-sm font-black text-slate-950">{name}</span>{odds ? <span dir="ltr" className="shrink-0 text-xs font-black text-blue-600">{odds.toFixed(2)}</span> : null}</div>;
}
