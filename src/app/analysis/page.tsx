import { AnalysisSportsView } from "@/components/analysis/AnalysisSportsView";
import { analysisMatches } from "@/lib/data";
import { normalizeSportCategoryId } from "@/lib/sports";

type AnalysisPageProps = {
  searchParams?: Promise<{
    sport?: string | string[];
  }>;
};

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
  const params = await searchParams;
  const initialSport = normalizeSportCategoryId(params?.sport);

  return (
    <section className="container-shell py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-accent-green">경기 분석 센터</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">경기 분석 센터</h1>
        <p className="mt-3 text-slate-400">
          오늘 경기별 GPT, Gemini, DeepSeek의 예상 결과와 AI 의견 일치도를 비교합니다.
        </p>
      </div>

      <AnalysisSportsView matches={analysisMatches} initialSport={initialSport} />
    </section>
  );
}
