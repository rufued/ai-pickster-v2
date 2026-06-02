import { BattleSportsView } from "@/components/battle/BattleSportsView";
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

      <BattleSportsView ais={aiCompetitors} matches={analysisMatches} />
    </section>
  );
}

