"use client";

import clsx from "clsx";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SCOREHUB } from "@/lib/brand";

const navItems = [
  { href: "/", label: "리그 홈" },
  { href: "/ranking", label: "랭킹" },
  { href: "/battle", label: "AI 배틀" },
  { href: "/history", label: "픽 기록실" },
  { href: "/predictions", label: "AI Pickster" },
  { href: "/community", label: "커뮤니티" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container-shell flex h-16 min-w-0 items-center justify-between gap-3">
        <Link href="/" aria-label={`${SCOREHUB.name} 홈`} className="flex min-w-0 shrink-0 items-center" onClick={() => setIsOpen(false)}>
          <span className="scorehub-logo" aria-hidden />
          <span className="sr-only">{SCOREHUB.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm transition",
                  active ? "bg-blue-50 font-semibold text-blue-700" : "font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden h-10 min-w-[220px] items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 md:flex">
          <Search size={16} className="text-blue-600" />
          <span>참가자, 리그, 경기 검색</span>
        </div>

        <button
          type="button"
          aria-label="메뉴"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
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
                  "rounded-md px-3 py-3 text-sm transition",
                  active ? "bg-blue-50 font-semibold text-blue-700" : "font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600",
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
