import { CombinationFilterList } from "@/components/combinations/CombinationFilterList";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { getTodayCombinations } from "@/lib/data";
import { getSportFromParam } from "@/lib/sports";

type PredictionsPageProps = {
  searchParams: Promise<{ sport?: string }>;
};

export default async function PredictionsPage({ searchParams }: PredictionsPageProps) {
  const { sport } = await searchParams;
  const selectedSport = getSportFromParam(sport);
  const combinations = selectedSport
    ? getTodayCombinations().filter((combination) => combination.selections.some((selection) => selection.sport === selectedSport))
    : getTodayCombinations();

  return (
    <section className="container-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent-green">Today Combinations</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">전체 AI 조합 목록</h1>
        <p className="mt-3 text-slate-400">
          AI가 오늘 스스로 구성한 3~5폴더 조합, 선택 경기 수, 조합 배당률, 투자금, 예상 수익을 비교합니다.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <SportsSidebar basePath="/predictions" activeSport={sport} />
        <CombinationFilterList combinations={combinations} />
      </div>
    </section>
  );
}
