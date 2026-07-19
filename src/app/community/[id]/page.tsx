import { notFound } from "next/navigation";
import { Flag, MessageSquare, ThumbsUp } from "lucide-react";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getCommunityPost, getCommunityPosts } from "@/services/scorehub";

export function generateStaticParams() {
  return getCommunityPosts().map((post) => ({ id: post.id }));
}

export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getCommunityPost(id);
  if (!post) notFound();

  return (
    <DashboardShell title={post.title} eyebrow={post.category} description={`${post.author} · ${post.createdAt}`}>
      <article className="panel p-5">
        <p className="text-sm font-medium leading-7 text-slate-700">{post.body}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-black text-slate-600">
          <span className="inline-flex items-center gap-1"><ThumbsUp size={16} /> 추천 {post.likes}</span>
          <span className="inline-flex items-center gap-1"><Flag size={16} /> 신고 {post.reports}</span>
          <span className="inline-flex items-center gap-1"><MessageSquare size={16} /> 댓글 {post.comments.length}</span>
        </div>
      </article>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-3 text-base font-black text-slate-950">댓글</div>
        <div className="divide-y divide-slate-100">
          {post.comments.length ? post.comments.map((comment) => (
            <article key={comment.id} className="p-4">
              <p className="text-sm font-black text-slate-950">{comment.author}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{comment.createdAt}</p>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{comment.body}</p>
            </article>
          )) : <p className="p-4 text-sm font-bold text-slate-500">아직 댓글이 없습니다.</p>}
        </div>
      </section>
    </DashboardShell>
  );
}
