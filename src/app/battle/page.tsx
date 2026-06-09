import { AiIdentity } from "@/components/ai/AiIdentity";
import { BattleSportsView } from "@/components/battle/BattleSportsView";
import { aiConfigs } from "@/lib/aiConfig";
import { aiCompetitors, analysisMatches } from "@/lib/data";
import { normalizeSportCategoryId } from "@/lib/sports";

type BattlePageProps = {
  searchParams?: Promise<{
    sport?: string | string[];
  }>;
};

export default async function BattlePage({ searchParams }: BattlePageProps) {
  const params = await searchParams;
  const initialSport = normalizeSportCategoryId(params?.sport);

  return (
    <section className="container-shell py-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-bold text-blue-600">AI Battle</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">AI 배틀</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-base leading-7 text-slate-600">
          <span>같은 경기에서</span>
          {aiConfigs.map((ai, index) => (
            <span key={ai.id} className="inline-flex items-center gap-1">
              <AiIdentity name={ai.name} showBadge={false} nameClassName="text-base" />
              {index < aiConfigs.length - 1 ? <span>,</span> : null}
            </span>
          ))}
          <span>의 예측을 비교합니다.</span>
        </p>
      </div>

      <BattleSportsView ais={aiCompetitors} matches={analysisMatches} initialSport={initialSport} />
    </section>
  );
}
