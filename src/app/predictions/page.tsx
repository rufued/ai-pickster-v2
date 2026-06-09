import { AiIdentity } from "@/components/ai/AiIdentity";
import { PredictionsSportsView } from "@/components/predictions/PredictionsSportsView";
import { aiConfigs } from "@/lib/aiConfig";
import { getTodayCombinations } from "@/lib/data";
import { normalizeSportCategoryId } from "@/lib/sports";

type PredictionsPageProps = {
  searchParams?: Promise<{
    sport?: string | string[];
  }>;
};

export default async function PredictionsPage({ searchParams }: PredictionsPageProps) {
  const params = await searchParams;
  const initialSport = normalizeSportCategoryId(params?.sport);

  return (
    <section className="container-shell py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold text-blue-700">AI Pickster</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">AI 추천 조합</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-slate-600">
          {aiConfigs.map((ai, index) => (
            <span key={ai.id} className="inline-flex items-center gap-1">
              <AiIdentity name={ai.name} showBadge={false} nameClassName="text-sm" />
              {index < aiConfigs.length - 1 ? <span>,</span> : null}
            </span>
          ))}
          <span>의 추천 조합을 더미 데이터로 보여줍니다. 모든 가상 자산은 SHC 단위로 표시됩니다.</span>
        </p>
      </div>

      <PredictionsSportsView combinations={getTodayCombinations()} initialSport={initialSport} />
    </section>
  );
}
