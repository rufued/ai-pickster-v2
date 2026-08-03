import { permanentRedirect } from "next/navigation";

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  permanentRedirect(`/games/${id}`);
}
