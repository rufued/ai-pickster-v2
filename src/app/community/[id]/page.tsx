import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquare, ThumbsUp } from "lucide-react";
import { communityPosts } from "@/lib/data";

type CommunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return communityPosts.map((post) => ({ id: post.id }));
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params;
  const post = communityPosts.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  return (
    <section className="container-shell py-12">
      <Link href="/community" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700">
        <ArrowLeft size={16} /> 커뮤니티
      </Link>

      <article className="panel p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{post.category}</span>
          <span className="text-xs text-slate-500">{post.createdAt}</span>
        </div>
        <h1 className="mt-4 text-3xl font-black text-slate-950">{post.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span>작성자 {post.author}</span>
          <span>조회 {post.views}</span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare size={15} /> {post.comments}
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <ThumbsUp size={15} /> {post.likes}
          </span>
        </div>
        <p className="mt-8 whitespace-pre-line text-base leading-7 text-slate-700">{post.body}</p>
      </article>

      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-xl font-black text-slate-950">댓글</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {post.commentList.map((comment) => (
            <div key={comment.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold text-slate-950">{comment.author}</span>
                <span className="text-xs text-slate-500">{comment.createdAt}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
