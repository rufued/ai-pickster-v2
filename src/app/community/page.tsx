import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";

export default function CommunityPage() {
  return (
    <DashboardShell title="커뮤니티" eyebrow="Community" description="목업 게시글은 모두 제거되었습니다.">
      <div className="panel p-12 text-center">
        <p className="font-black text-slate-800">등록된 실제 커뮤니티 데이터가 없습니다.</p>
        <p className="mt-2 text-sm font-medium text-slate-500">커뮤니티 테이블이 연결되기 전까지 가짜 게시글을 표시하지 않습니다.</p>
      </div>
    </DashboardShell>
  );
}
