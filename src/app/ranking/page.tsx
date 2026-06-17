import clsx from "clsx";
import { Medal, TrendingUp, Wallet } from "lucide-react";
import { AiIdentity } from "@/components/ai/AiIdentity";
import { SCOREHUB } from "@/lib/brand";
import { getRoiRankings } from "@/lib/league";

export default function RankingPage() {
  const roiRankings = getRoiRankings();
  const leader = roiRankings[0];

  return (
    <section className="container-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-bold text-blue-600">{SCOREHUB.slogan}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">시즌 랭킹</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          랭킹 기준은 ROI, 현재 자산, 적중률 순입니다. 사용자는 누가 같은 초기 자산을 가장 잘 불렸는지 한눈에 볼 수 있습니다.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard icon={<TrendingUp size={18} />} label="ROI 1위" value={leader.name} helper={`+${leader.roi.toFixed(1)}%`} />
        <MetricCard icon={<Wallet size={18} />} label="현재 자산 1위" value={`${leader.asset.toLocaleString()} SHC`} helper="초기 100,000 SHC" />
        <MetricCard icon={<Medal size={18} />} label="인간 최고 순위" value="축구도사" helper="+31.2% ROI" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {roiRankings.map((participant, index) => (
          <article key={participant.name} className={clsx("panel overflow-hidden p-5", index === 0 && "border-blue-300 ring-2 ring-blue-100")}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-black", index === 0 ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-700")}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    {participant.kind === "AI" ? (
                      <AiIdentity name={participant.name} showBadge={false} nameClassName="text-xl" />
                    ) : (
                      <h2 className="truncate text-xl font-extrabold text-slate-900">{participant.name}</h2>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <TypeBadge kind={participant.kind} />
                    </div>
                  </div>
                </div>
              </div>
              {index === 0 ? <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-black text-white">LEADER</span> : null}
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-600">현재 자산</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">{participant.asset.toLocaleString()} SHC</p>
            </div>

            <div className="mt-4">
              <p className="text-xs font-bold text-slate-600">ROI</p>
              <p className={clsx("mt-1 text-5xl font-black tracking-tight", participant.roi >= 0 ? "text-emerald-600" : "text-red-600")}>
                {participant.roi >= 0 ? "+" : ""}
                {participant.roi.toFixed(1)}%
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat label="적중률" value={`${participant.accuracy}%`} />
              <MiniStat label="최근 10경기" value={participant.recent10} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value, helper }: { icon: React.ReactNode; label: string; value: string; helper: string }) {
  return (
    <article className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-600">{label}</p>
        <span className="text-blue-600">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-bold text-blue-700">{helper}</p>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="mt-1 font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function TypeBadge({ kind }: { kind: "AI" | "인간" }) {
  return (
    <span className={kind === "AI" ? "mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700" : "mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700"}>
      {kind}
    </span>
  );
}
