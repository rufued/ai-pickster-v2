import Link from "next/link";
import { MessageCircle, PenLine } from "lucide-react";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getTranslations } from "@/i18n/server";
import { COMMUNITY_PAGE_SIZE, getCommunityPosts, type CommunityCategory } from "@/lib/community-data";
import { isCommunityCategory } from "@/lib/community-auth";

export const dynamic = "force-dynamic"; export const revalidate = 0;

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const t = await getTranslations(); const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1); const category = isCommunityCategory(params.category) ? params.category : undefined;
  const { posts, count } = await getCommunityPosts(page, category); const pages = Math.max(1, Math.ceil(count / COMMUNITY_PAGE_SIZE));
  const categories: Array<[string, string]> = [["", t("community.all")], ["free", t("community.free")], ["game_analysis", t("community.gameAnalysis")], ["ai_discussion", t("community.aiDiscussion")]];
  const categoryLabel = (value: CommunityCategory) => value === "free" ? t("community.free") : value === "game_analysis" ? t("community.gameAnalysis") : t("community.aiDiscussion");
  return <DashboardShell title={t("community.title")} eyebrow="Community" description={t("community.description")}>
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2 overflow-x-auto pb-1">{categories.map(([value,label]) => <Link key={value || "all"} href={value ? `/community?category=${value}` : "/community"} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${category === value || (!category && !value) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{label}</Link>)}</div><Link href="/community/write" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-black text-white"><PenLine size={16}/>{t("community.write")}</Link></div>
      {posts.length ? <div className="divide-y divide-slate-100">{posts.map((post) => <Link href={`/community/${post.id}`} key={post.id} className={`grid gap-2 px-4 py-4 transition hover:bg-blue-50/60 sm:grid-cols-[110px_minmax(0,1fr)_150px_145px] sm:items-center sm:px-5 ${post.is_admin ? "bg-blue-50/40" : "hover:bg-slate-50"}`}><span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{categoryLabel(post.category as CommunityCategory)}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-1.5">{post.is_pinned ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-700">{t("community.pinnedBadge")}</span> : null}{post.is_admin ? <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-black text-white">{t("community.operatorBadge")}</span> : null}<p className="break-words font-black text-slate-900">{post.title}</p></div><p className="mt-1 text-xs font-medium text-slate-500 sm:hidden">{post.nickname} · <LocalDateTime value={post.created_at} mode="mobile" /></p></div><span className={`hidden truncate text-sm sm:block ${post.is_admin ? "font-black text-blue-700" : "font-bold text-slate-600"}`}>{post.nickname}</span><span className="flex items-center gap-3 text-xs font-bold text-slate-500"><span className="hidden sm:inline"><LocalDateTime value={post.created_at} mode="mobile" /></span><span className="inline-flex items-center gap-1"><MessageCircle size={14}/>{post.comment_count}</span></span></Link>)}</div> : <div className="p-12 text-center"><p className="font-black text-slate-800">{t("community.empty")}</p><p className="mt-2 text-sm text-slate-500">{t("community.emptyDesc")}</p></div>}
      {pages > 1 ? <nav className="flex flex-wrap justify-center gap-2 border-t border-slate-100 p-4">{Array.from({length: pages},(_,i)=>i+1).map(number => <Link key={number} href={`/community?page=${number}${category ? `&category=${category}` : ""}`} className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-black ${number === page ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{number}</Link>)}</nav> : null}
    </section>
  </DashboardShell>;
}
