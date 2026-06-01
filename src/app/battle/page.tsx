import { BattleCard } from "@/components/battle/BattleCard";
import { BattleRanking } from "@/components/battle/BattleRanking";
import { AiProfileCard } from "@/components/ai/AiProfileCard";
import { aiCompetitors, analysisMatches } from "@/lib/data";

export default function BattlePage() {
  return (
    <section className="container-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent-green">AI Battle Arena</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">AI 배틀</h1>
        <p className="mt-3 text-slate-400">
          한 경기를 기준으로 GPT, Gemini, DeepSeek의 예측이 어떻게 맞붙는지 비교합니다.
        </p>
      </div>

      <div className="mb-8">
        <BattleRanking ais={aiCompetitors} />
      </div>

      <div className="mb-8">
        <div className="mb-5">
          <p className="text-sm font-semibold text-accent-green">AI Profiles</p>
          <h2 className="mt-1 text-2xl font-black text-white">배틀 참가 AI 스타일</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {aiCompetitors.map((ai) => (
            <AiProfileCard key={ai.id} ai={ai} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {analysisMatches.map((match) => (
          <BattleCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
