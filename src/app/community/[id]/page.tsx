import Link from "next/link";
import { notFound } from "next/navigation";
import { CommunityPostForm } from "@/components/community/CommunityPostForm";
import { CommentDelete, CommentForm, PostActions } from "@/components/community/CommunityPostActions";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { LocalDateTime } from "@/components/ui/LocalDateTime";
import { getTranslations } from "@/i18n/server";
import { getCommunityPost } from "@/lib/community-data";
import { isCommunityCategory } from "@/lib/community-auth";

export const dynamic = "force-dynamic"; export const revalidate = 0;
export default async function CommunityDetailPage({ params, searchParams }: { params: Promise<{id:string}>; searchParams: Promise<{mode?:string}> }) {
  const t = await getTranslations(); const { id } = await params; const { mode } = await searchParams; const post = await getCommunityPost(id); if (!post) notFound();
  const label = post.category === "free" ? t("community.free") : post.category === "game_analysis" ? t("community.gameAnalysis") : t("community.aiDiscussion");
  if (mode === "edit") return <DashboardShell title={t("community.editPost")} eyebrow="Community" description={t("community.passwordToEdit")}><CommunityPostForm postId={id} initial={{category: isCommunityCategory(post.category) ? post.category : "free", title:post.title, content:post.content, nickname:post.nickname}} /></DashboardShell>;
  return <DashboardShell title={post.title} eyebrow={label} description={`${post.nickname} · ${t("community.postedAt")}`}>
    <article className={`panel overflow-hidden ${post.is_admin ? "ring-2 ring-blue-200" : ""}`}><header className={`flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 ${post.is_admin ? "border-blue-100 bg-blue-50/50" : "border-slate-100"}`}><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{label}</span>{post.is_pinned ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700">{t("community.pinnedBadge")}</span> : null}{post.is_admin ? <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-black text-white">{t("community.operatorBadge")}</span> : null}</div><p className="mt-3 text-sm font-bold text-slate-600"><span className={post.is_admin ? "font-black text-blue-700" : ""}>{post.nickname}</span> · <LocalDateTime value={post.created_at}/></p></div><PostActions postId={id}/></header><div className="min-h-48 whitespace-pre-wrap break-words p-4 text-[15px] font-medium leading-8 text-slate-800 sm:p-7">{post.content}</div></article>
    <section className="panel p-4 sm:p-6"><div className="mb-4 flex items-center justify-between"><h2 className="font-black text-slate-950">{t("community.comments")} <span className="text-blue-600">{post.comments.length}</span></h2><Link href="/community" className="text-sm font-black text-slate-500">{t("community.backToList")}</Link></div><div className="mb-5 divide-y divide-slate-100">{post.comments.length ? post.comments.map((comment: { id: string; nickname: string; content: string; created_at: string }) => <article key={comment.id} className="py-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-black text-slate-800">{comment.nickname} <span className="ms-2 text-xs font-medium text-slate-400"><LocalDateTime value={comment.created_at} mode="mobile"/></span></p><CommentDelete commentId={comment.id}/></div><p className="mt-2 whitespace-pre-wrap break-words text-sm font-medium leading-6 text-slate-700">{comment.content}</p></article>) : <p className="py-6 text-center text-sm font-medium text-slate-500">{t("community.noComments")}</p>}</div><CommentForm postId={id}/></section>
  </DashboardShell>;
}
