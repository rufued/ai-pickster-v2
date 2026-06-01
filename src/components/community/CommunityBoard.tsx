"use client";

import Link from "next/link";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useMemo, useState } from "react";
import clsx from "clsx";
import type { CommunityCategory, CommunityPost } from "@/lib/types";

const categories: Array<"전체" | CommunityCategory> = ["전체", "자유게시판", "경기분석", "픽공유", "질문답변", "AI토론"];

type CommunityBoardProps = {
  posts: CommunityPost[];
};

export function CommunityBoard({ posts }: CommunityBoardProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("전체");

  const filteredPosts = useMemo(
    () => (activeCategory === "전체" ? posts : posts.filter((post) => post.category === activeCategory)),
    [activeCategory, posts],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={clsx(
              "rounded-md border px-4 py-2 text-sm font-semibold transition",
              activeCategory === category
                ? "border-accent-green bg-accent-green text-black"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="divide-y divide-white/10">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`} className="grid gap-3 p-5 transition hover:bg-white/[0.03] lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-accent-green/30 bg-accent-green/10 px-2.5 py-1 text-xs font-bold text-accent-green">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500">{post.createdAt}</span>
                </div>
                <h2 className="mt-3 text-lg font-black text-white">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-400">작성자 {post.author}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400 lg:justify-end">
                <span>조회 {post.views}</span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare size={15} /> {post.comments}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <ThumbsUp size={15} /> {post.likes}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
