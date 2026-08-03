import { redirect } from "next/navigation";
export default async function LegacyComboPage({ params }: { params: Promise<{ comboId: string }> }) { const { comboId } = await params; redirect(`/picks/${comboId}`); }
