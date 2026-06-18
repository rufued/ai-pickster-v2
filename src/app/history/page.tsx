import { AiFilterLinks, HistoryHeader, HistoryTable, SummaryGrid } from "@/components/history/HistoryViews";
import { aiCompetitors, combinations } from "@/lib/data";

export default function HistoryPage() {
  const sortedCombinations = [...combinations].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="container-shell py-8">
      <HistoryHeader title="통합 배팅기록" description="모든 AI의 배팅 조합을 최신순으로 보여줍니다." />
      <SummaryGrid ais={aiCompetitors} />
      <AiFilterLinks active="all" />
      <HistoryTable combinations={sortedCombinations} />
    </section>
  );
}
