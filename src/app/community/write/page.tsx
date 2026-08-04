import { cookies } from "next/headers";
import { CommunityPostForm } from "@/components/community/CommunityPostForm";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getTranslations } from "@/i18n/server";
import { ADMIN_COOKIE, validAdminToken } from "@/lib/admin-auth";

export default async function CommunityWritePage() {
  const t = await getTranslations();
  const isAdmin = await validAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
  return (
    <DashboardShell title={t("community.write")} eyebrow="Community" description={isAdmin ? "SHadmin 계정으로 작성됩니다." : t("community.writeDescription")}>
      <CommunityPostForm isAdmin={isAdmin} />
    </DashboardShell>
  );
}
