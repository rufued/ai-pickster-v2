import { BattleCard } from "@/components/battle/BattleCard";
import { BattleRanking } from "@/components/battle/BattleRanking";
import { AiProfileCard } from "@/components/ai/AiProfileCard";
import { SportsSidebar } from "@/components/sports/SportsSidebar";
import { aiCompetitors, analysisMatches } from "@/lib/data";
import { getSportFromParam } from "@/lib/sports";

type BattlePageProps = {
  searchParams: Promise<{ sport?: string }>;
};

export default async function BattlePage({ searchParams }: BattlePageProps) {
  const { sport } = await searchParams;
  const selectedSport = getSportFromParam(sport);
  const filteredMatches = selectedSport ? analysisMatches.filter((match) => match.sport === selectedSport) : analysisMatches;

  return (
    <section className="container-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent-green">AI Battle Arena</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">AI 배틀</h1>
        <p className="mt-3 text-slate-400">
          한 경기를 기준으로 GPT, Gemini, DeepSeek의 예측이 어떻게 맞붙는지 비교합니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <SportsSidebar basePath="/battle" activeSport={sport} />
        <div>
          <div className="mb-8">
            <BattleRanking ais={aiCompetitors} />
          </div>

          <div className="mb-8">
            <div className="mb-5">
              <p className="text-sm font-semibold text-accent-green">AI Profiles</p>
              <h2 className="mt-1 text-2xl font-black text-white">배틀 참가 AI 스타일</h2>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              {aiCompetitors.map((ai) => (
                <AiProfileCard key={ai.id} ai={ai} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {filteredMatches.map((match) => (
              <BattleCard key={match.id} match={match} />
            ))}
            {filteredMatches.length === 0 ? (
              <div className="panel p-5 text-sm text-slate-400 xl:col-span-2">현재 더미데이터에는 해당 종목 배틀이 없습니다.</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
