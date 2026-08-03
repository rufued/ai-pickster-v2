import { CommunityPostForm } from "@/components/community/CommunityPostForm";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";
import { getTranslations } from "@/i18n/server";
export default async function CommunityWritePage() { const t = await getTranslations(); return <DashboardShell title={t("community.write")} eyebrow="Community" description={t("community.writeDescription")}><CommunityPostForm /></DashboardShell>; }

