"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";

export function PostActions({ postId }: { postId: string }) {
  const { t } = useI18n(); const router = useRouter(); const [busy, setBusy] = useState(false);
  async function remove() {
    const password = window.prompt(t("community.passwordToDelete")); if (!password) return;
    if (!window.confirm(t("community.deleteConfirm"))) return; setBusy(true);
    const response = await fetch(`/api/community/posts/${postId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json().catch(() => ({})); setBusy(false);
    if (!response.ok) { window.alert(result.error ?? t("community.error")); return; }
    router.push("/community"); router.refresh();
  }
  return <div className="flex gap-2"><Link href={`/community/${postId}/edit`} className="rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50">{t("community.edit")}</Link><button disabled={busy} onClick={remove} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50"><Trash2 size={13} />{t("community.delete")}</button></div>;
}

export function CommentForm({ postId }: { postId: string }) {
  const { t } = useI18n(); const router = useRouter(); const [nickname, setNickname] = useState(""); const [password, setPassword] = useState(""); const [content, setContent] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(""); const response = await fetch(`/api/community/posts/${postId}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname, password, content }) }); const result = await response.json().catch(() => ({})); setBusy(false); if (!response.ok) { setError(result.error ?? t("community.error")); return; } setContent(""); setPassword(""); router.refresh(); }
  const input = "rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500";
  return <form onSubmit={submit} className="space-y-3 rounded-xl bg-slate-50 p-4"><div className="grid gap-2 sm:grid-cols-2"><input className={input} value={nickname} onChange={(e) => setNickname(e.target.value)} minLength={2} maxLength={30} required placeholder={t("community.nickname")} /><input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={4} maxLength={72} required placeholder={t("community.passwordHint")} /></div><textarea className={`${input} w-full resize-y leading-6`} value={content} onChange={(e) => setContent(e.target.value)} maxLength={2000} rows={4} required placeholder={t("community.commentPlaceholder")} />{error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}<div className="flex justify-end"><button disabled={busy} className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50">{busy ? t("community.saving") : t("community.addComment")}</button></div></form>;
}

export function CommentDelete({ commentId }: { commentId: string }) {
  const { t } = useI18n(); const router = useRouter();
  async function remove() { const password = window.prompt(t("community.passwordToDeleteComment")); if (!password) return; const response = await fetch(`/api/community/comments/${commentId}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); const result = await response.json().catch(() => ({})); if (!response.ok) return window.alert(result.error ?? t("community.error")); router.refresh(); }
  return <button onClick={remove} className="text-xs font-bold text-slate-400 hover:text-red-600">{t("community.delete")}</button>;
}

