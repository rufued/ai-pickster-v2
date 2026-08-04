"use client";

import clsx from "clsx";
import { PenLine } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SCOREHUB } from "@/lib/brand";

export function AdminHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "monitor" ? "monitor" : "picks";
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950 text-white">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-6">
          <span className="shrink-0 text-sm font-black tracking-wide">
            <span className="text-blue-400">{SCOREHUB.name}</span> <span className="text-white">Admin</span>
          </span>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin?tab=picks"
              className={clsx(
                "rounded-md px-3 py-2 text-sm font-bold transition",
                tab === "picks" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              운영자 픽
            </Link>
            <Link
              href="/admin?tab=monitor"
              className={clsx(
                "rounded-md px-3 py-2 text-sm font-bold transition",
                tab === "monitor" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white",
              )}
            >
              운영 모니터링
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/community/write"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-500"
          >
            <PenLine size={14} />
            커뮤니티에 글쓰기
          </Link>
          <Link href="/" className="rounded-md border border-slate-700 px-3 py-2 text-xs font-black text-slate-200 transition hover:bg-slate-800">
            사이트로 돌아가기
          </Link>
          <button
            type="button"
            disabled={loggingOut}
            onClick={logout}
            className="rounded-md bg-red-600 px-3 py-2 text-xs font-black text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
