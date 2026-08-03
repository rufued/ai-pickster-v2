import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { AdminConsole } from "@/components/admin/AdminConsole";
export const dynamic = "force-dynamic";
export default function AdminPage() { return <DashboardShell eyebrow="ScoreHub Admin" title="SHadmin 콘솔" description="SHadmin 픽 입력과 데이터 파이프라인 상태를 관리합니다."><AdminConsole /></DashboardShell>; }
