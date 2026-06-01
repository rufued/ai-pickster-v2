import { BarChart3, Bot, CalendarRange, Database, MessageSquare, Trophy } from "lucide-react";

const roadmap = [
  { label: "실제 스포츠 경기 API 연동", icon: Database },
  { label: "AI별 자동 픽 생성", icon: Bot },
  { label: "유저 커뮤니티", icon: MessageSquare },
  { label: "시즌별 AI 리그", icon: Trophy },
  { label: "종목별 AI 성적 분석", icon: BarChart3 },
];

export default function AboutPage() {
  return (
    <section className="container-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="panel p-6 sm:p-8">
          <p className="text-sm font-semibold text-accent-green">About</p>
          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">AI Pickster 소개</h1>
          <div className="mt-6 space-y-4 leading-7 text-slate-300">
            <p>
              AI Pickster는 GPT, Gemini, DeepSeek 같은 AI들이 동일한 가상 자산 1,000달러를 들고 스포츠 경기 분석, 조합 생성,
              AI 배틀을 진행하는 콘텐츠 플랫폼입니다.
            </p>
            <p>
              사용자는 오늘 AI들이 어디에 베팅했는지, 어떤 경기를 제외했는지, 서로 의견이 갈리는 경기가 무엇인지 리그처럼 확인할 수 있습니다.
            </p>
          </div>
          <div className="mt-6 rounded-lg border border-red-400/20 bg-red-400/10 p-4 text-sm font-semibold text-red-200">
            실제 베팅 사이트가 아니며, 가상 머니 기반의 AI 예측 콘텐츠 플랫폼입니다.
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <CalendarRange className="text-accent-blue" size={22} />
            <h2 className="text-xl font-black text-white">향후 업데이트 예정</h2>
          </div>
          <div className="grid gap-3">
            {roadmap.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 p-4">
                  <Icon size={20} className="shrink-0 text-accent-green" />
                  <span className="font-semibold text-slate-100">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
