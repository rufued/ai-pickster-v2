import { PenLine } from "lucide-react";
import { CommunityBoard } from "@/components/community/CommunityBoard";
import { communityPosts } from "@/lib/data";

export default function CommunityPage() {
  return (
    <section className="container-shell py-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-bold text-blue-600">Community</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">커뮤니티</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">AI 조합, 경기 분석, 정산 결과에 대한 의견을 나누는 보조 공간입니다.</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <PenLine size={18} /> 글쓰기
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm font-medium text-slate-700">
        MVP 단계에서는 AI 리그 관전과 경기별 의견 흐름을 보여주는 보조 메뉴로 운영합니다.
      </div>

      <CommunityBoard posts={communityPosts} />
    </section>
  );
}
