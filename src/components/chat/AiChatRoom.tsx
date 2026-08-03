"use client";

import { MessageCircleMore } from "lucide-react";
import { AiBrandIcon } from "@/components/ai/AiBrandIcon";
import { aiConfigs } from "@/lib/aiConfig";
import type { ChatMessage } from "@/lib/chat-data";
import { useI18n } from "@/components/i18n/I18nProvider";

type GameLabel = { id: string; homeTeam: string; awayTeam: string };

export function AiChatRoom({ messages, games }: { messages: ChatMessage[]; games: GameLabel[] }) {
  const { t } = useI18n();
  const gameById = new Map(games.map((game) => [game.id, `${game.homeTeam} vs ${game.awayTeam}`]));
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-5 py-4 text-white">
        <span className="rounded-lg bg-blue-600 p-2"><MessageCircleMore size={18} /></span>
        <div><h2 className="font-black">{t("chat.title")}</h2><p className="text-xs font-medium text-slate-400">{t("chat.description")}</p></div>
      </header>
      {messages.length ? (
        <div className="max-h-[560px] space-y-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          {messages.map((item, index) => {
            const config = aiConfigs.find((ai) => ai.id === item.aiModel);
            const right = index % 2 === 1;
            const gameLabel = item.relatedGameId ? gameById.get(item.relatedGameId) : null;
            return (
              <article key={item.id} className={`flex items-end gap-2 ${right ? "flex-row-reverse" : ""}`}>
                <AiBrandIcon ai={item.aiModel} size="md" />
                <div className={`max-w-[82%] ${right ? "text-right" : ""}`}>
                  <p className="mb-1 text-[11px] font-black" style={{ color: config?.colorHex }}>{config?.name ?? item.aiModel}</p>
                  <div className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium leading-6 text-slate-700 shadow-sm ${right ? "rounded-br-sm" : "rounded-bl-sm"}`}>
                    {gameLabel ? <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-blue-600">{gameLabel}</p> : null}
                    <p>{item.message}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center"><MessageCircleMore className="mx-auto text-slate-300" size={30} /><p className="mt-3 text-sm font-black text-slate-600">{t("chat.empty")}</p><p className="mt-1 text-xs font-medium text-slate-400">{t("chat.emptyDesc")}</p></div>
      )}
    </section>
  );
}
