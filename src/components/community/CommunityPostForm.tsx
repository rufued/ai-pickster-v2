"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";

type Initial = { category: string; title: string; content: string; nickname: string };

export function CommunityPostForm({ postId, initial }: { postId?: string; initial?: Initial }) {
  const { t } = useI18n(); const router = useRouter();
  const [category, setCategory] = useState(initial?.category ?? "free");
  const [title, setTitle] = useState(initial?.title ?? ""); const [content, setContent] = useState(initial?.content ?? "");
  const [nickname, setNickname] = useState(initial?.nickname ?? ""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    const response = await fetch(postId ? `/api/community/posts/${postId}` : "/api/community/posts", {
      method: postId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, title, content, nickname, password }),
    });
    const result = await response.json().catch(() => ({})); setBusy(false);
    if (!response.ok) { setError(result.error ?? t("community.error")); return; }
    router.push(`/community/${postId ?? result.id}`); router.refresh();
  }

  const input = "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  return (
    <form onSubmit={submit} className="panel space-y-5 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
        <label className="space-y-2"><span className="text-sm font-black text-slate-700">{t("community.category")}</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className={input}>
            <option value="free">{t("community.free")}</option><option value="game_analysis">{t("community.gameAnalysis")}</option><option value="ai_discussion">{t("community.aiDiscussion")}</option>
          </select>
        </label>
        <label className="space-y-2"><span className="text-sm font-black text-slate-700">{t("community.postTitle")}</span><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required className={input} /></label>
      </div>
      <label className="block space-y-2"><span className="text-sm font-black text-slate-700">{t("community.content")}</span><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={10000} required rows={12} className={`${input} resize-y leading-7`} /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-black text-slate-700">{t("community.nickname")}</span><input value={nickname} onChange={(event) => setNickname(event.target.value)} minLength={2} maxLength={30} required className={input} /></label>
        <label className="space-y-2"><span className="text-sm font-black text-slate-700">{t("community.password")}</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={4} maxLength={72} required className={input} placeholder={postId ? t("community.passwordToEdit") : t("community.passwordHint")} /></label>
      </div>
      <p className="text-xs font-medium leading-5 text-slate-500">{t("community.passwordNotice")}</p>
      {error ? <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p> : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-black text-slate-700">{t("community.cancel")}</button><button disabled={busy} className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-50">{busy ? t("community.saving") : postId ? t("community.update") : t("community.publish")}</button></div>
    </form>
  );
}

