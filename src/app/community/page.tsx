"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flag, MessageSquare, ThumbsUp } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getCommunityPosts } from "@/services/scorehub";
import type { CommunityCategory } from "@/data/community";

const categories: Array<"전체" | CommunityCategory> = ["전체", "자유", "경기분석", "AI 토론"];

export default function CommunityPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("전체");
  const posts = getCommunityPosts();
  const rows = useMemo(() => (category === "전체" ? posts : posts.filter((post) => post.category === category)), [category, posts]);

  return (
    <DashboardShell title="커뮤니티" eyebrow="Community" description="자유, 경기분석, AI 토론을 위한 단순 게시판입니다.">
      <AdSlot placement="community_top" />
      <div className="flex flex-wrap gap-2">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={category === item ? "rounded-md bg-blue-600 px-3 py-2 text-sm font-black text-white" : "rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 hover:bg-blue-50"}>
            {item}
          </button>
        ))}
      </div>
      <section className="panel overflow-hidden">
        <div className="divide-y divide-slate-100">
          {rows.map((post, index) => (
            <Link key={post.id} href={`/community/${post.id}`} className="block p-4 transition hover:bg-blue-50/50">
              {index === 1 ? <AdSlot placement="community_inline" /> : null}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">{post.category}</span>
                <span>{post.createdAt}</span>
                <span>{post.author}</span>
              </div>
              <h2 className="mt-3 text-lg font-black text-slate-950">{post.title}</h2>
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
                <span>조회 {post.views}</span>
                <span className="inline-flex items-center gap-1"><MessageSquare size={15} /> {post.comments.length}</span>
                <span className="inline-flex items-center gap-1 text-emerald-600"><ThumbsUp size={15} /> {post.likes}</span>
                <span className="inline-flex items-center gap-1"><Flag size={15} /> {post.reports}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
