"use client";

import clsx from "clsx";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "스코어" },
  { href: "/analysis", label: "경기분석" },
  { href: "/ranking", label: "AI 랭킹" },
  { href: "/history", label: "기록실" },
  { href: "/community", label: "커뮤니티" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-black text-white">
            AI
          </span>
          <span className="text-base font-black tracking-tight text-slate-950">AI Sports Hub</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-bold transition",
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden h-10 min-w-[220px] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 md:flex">
          <Search size={16} />
          <span>팀, 리그, 경기 검색</span>
        </div>

        <button
          type="button"
          aria-label="메뉴"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen ? (
        <nav className="container-shell grid gap-1 border-t border-slate-200 py-3 lg:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "rounded-md px-3 py-3 text-sm font-bold",
                  active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
