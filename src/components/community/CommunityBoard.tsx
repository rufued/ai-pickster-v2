"use client";

import clsx from "clsx";
import { MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
              "rounded-md border px-4 py-2 text-sm transition",
              activeCategory === category
                ? "border-blue-600 bg-blue-600 font-semibold text-white"
                : "border-slate-200 bg-white font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`} className="grid gap-3 p-5 transition hover:bg-blue-50/60 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {post.category}
                  </span>
                  <span className="text-xs font-medium text-slate-600">{post.createdAt}</span>
                </div>
                <h2 className="mt-3 truncate text-lg font-extrabold text-slate-900">{post.title}</h2>
                <p className="mt-2 text-sm font-medium text-slate-600">작성자 {post.author}</p>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-600 lg:justify-end">
                <span>조회 {post.views}</span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare size={15} /> {post.comments}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
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
