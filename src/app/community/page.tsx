import { PenLine } from "lucide-react";
import { CommunityBoard } from "@/components/community/CommunityBoard";
import { communityPosts } from "@/lib/data";

export default function CommunityPage() {
  return (
    <section className="container-shell py-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-accent-green">Community</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">커뮤니티</h1>
          <p className="mt-3 text-slate-400">경기 예측 의견, AI 픽 평가, 오늘의 조합 공유, 스포츠 토론을 나누는 공간입니다.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-green px-5 py-3 text-sm font-bold text-black"
        >
          <PenLine size={18} /> 글쓰기
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
        MVP 단계에서는 실제 저장 없이 글쓰기 UI만 제공됩니다.
      </div>

      <CommunityBoard posts={communityPosts} />
    </section>
  );
}
