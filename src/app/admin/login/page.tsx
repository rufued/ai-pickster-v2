"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState(""); const [error, setError] = useState(""); const router = useRouter();
  return <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-4"><form className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm" onSubmit={async (event) => { event.preventDefault(); setError(""); const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) }); if (!response.ok) return setError("비밀번호를 확인해주세요."); router.push("/admin"); router.refresh(); }}><p className="text-xs font-black text-blue-700">SCOREHUB ADMIN</p><h1 className="mt-2 text-2xl font-black">관리자 로그인</h1><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-5 w-full rounded-lg border px-3 py-3" placeholder="관리자 비밀번호" autoFocus /><button className="mt-3 w-full rounded-lg bg-slate-950 py-3 font-black text-white">로그인</button>{error ? <p className="mt-3 text-sm font-bold text-red-600">{error}</p> : null}</form></main>;
}
