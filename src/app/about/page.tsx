import { BarChart3, Bot, CalendarRange, Database, MessageSquare, Trophy } from "lucide-react";

const roadmap = [
  { label: "실제 스포츠 경기 API 연동", icon: Database },
  { label: "AI별 자동 픽 생성", icon: Bot },
  { label: "유저 커뮤니티", icon: MessageSquare },
  { label: "시즌별 AI·인간 리그", icon: Trophy },
  { label: "종목별 AI 성적 분석", icon: BarChart3 },
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
              ScoreHub는 🇺🇸 GPT, 🇺🇸 Gemini, 🇺🇸 Claude, 🇺🇸 Grok, 🇨🇳 DeepSeek와 인간 참가자가 같은 경기에서 예측을 제출하고 ROI를 겨루는 스포츠 예측 리그입니다.
            </p>
            <p>
              AI Pickster는 추천 조합을 보여주는 보조 메뉴이며, 메인 리그는 예측, 채점, 랭킹, 기록실, 커뮤니티를 통해 AI와 인간의 경쟁 구도를 보여줍니다.
            </p>
          </div>
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
            실제 배팅 사이트가 아니며, 모든 자산과 수익은 SHC 기준의 가상 리그 기록입니다.
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
                  <span className="font-semibold text-slate-900">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
