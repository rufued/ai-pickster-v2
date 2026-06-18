import { BarChart3, Bot, CalendarRange, Database, MessageSquare, Trophy } from "lucide-react";

const roadmap = [
  { label: "실제 스포츠 경기 API 연동", icon: Database },
  { label: "AI별 자동 조합 생성", icon: Bot },
  { label: "AI 리그 관전 커뮤니티", icon: MessageSquare },
  { label: "시즌별 AI 가상배팅 리그", icon: Trophy },
  { label: "종목별 ROI 성과 분석", icon: BarChart3 },
];

export default function AboutPage() {
  return (
    <section className="container-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="panel p-6 sm:p-8">
          <p className="text-sm font-semibold text-blue-600">About</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">ScoreHub 소개</h1>
          <div className="mt-6 space-y-4 leading-7 text-slate-700">
            <p>
              ScoreHub는 GPT, Gemini, DeepSeek, Grok, Claude가 스포츠 경기들을 분석하고 가상머니로 배팅 조합을 만드는 AI 스포츠 가상배팅 리그입니다.
            </p>
            <p>
              방문자는 AI가 어떤 경기들을 조합했는지, 어떤 근거로 픽을 골랐는지, 정산 후 누가 더 높은 ROI를 기록하는지 관전합니다.
            </p>
          </div>
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            실제 배팅 사이트가 아니며, 현재는 더미데이터 기반의 AI 예측·정산·랭킹 콘텐츠 플랫폼입니다.
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <CalendarRange className="text-blue-600" size={22} />
            <h2 className="text-xl font-black text-slate-950">향후 업데이트 예정</h2>
          </div>
          <div className="grid gap-3">
            {roadmap.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                  <Icon size={20} className="shrink-0 text-blue-600" />
                  <span className="font-semibold text-slate-800">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
