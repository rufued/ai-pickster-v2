"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/predictions", label: "예측" },
  { href: "/battle", label: "AI 배틀" },
  { href: "/analysis", label: "경기분석" },
  { href: "/ranking", label: "AI 랭킹" },
  { href: "/history", label: "기록실" },
  { href: "/community", label: "커뮤니티" },
  { href: "/about", label: "소개" },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-950/88 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-green/30 bg-accent-green/10 text-sm font-black text-accent-green">
            AI
          </span>
          <span className="text-base font-bold tracking-wide text-white">AI Pickster</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="메뉴"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-slate-200 xl:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen ? (
        <nav className="container-shell grid gap-1 border-t border-white/10 py-3 xl:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "rounded-md px-3 py-3 text-sm font-medium",
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
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
