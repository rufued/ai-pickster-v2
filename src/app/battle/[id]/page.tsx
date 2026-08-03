import { permanentRedirect } from "next/navigation";

export default async function BattleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  permanentRedirect(`/games/${id}`);
}
