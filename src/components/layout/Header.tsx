"use client";

import clsx from "clsx";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SCOREHUB } from "@/lib/brand";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { TelegramLink } from "@/components/social/TelegramLink";
import { useI18n } from "@/components/i18n/I18nProvider";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { href: "/", label: t("nav.home") }, { href: "/picks", label: t("nav.picks") },
    { href: "/records", label: t("nav.records") }, { href: "/games", label: t("nav.games") },
    { href: "/community", label: t("nav.community") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-3">
        <Link href="/" aria-label={SCOREHUB.name} className="flex shrink-0 items-center" onClick={() => setIsOpen(false)}>
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
                  active ? "bg-blue-50 font-black text-blue-700" : "font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <SearchForm placeholder={t("nav.search")} className="hidden min-w-[220px] md:flex" />

        <LanguageSwitcher />

        <TelegramLink />

        <button
          type="button"
          aria-label={t("nav.menu")}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen ? (
        <nav className="container-shell grid gap-1 border-t border-slate-200 py-3 lg:hidden">
          <SearchForm placeholder={t("nav.search")} className="mb-2 flex md:hidden" onSubmit={() => setIsOpen(false)} />
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "rounded-md px-3 py-3 text-sm transition",
                  active ? "bg-blue-50 font-black text-blue-700" : "font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-3">
            <TelegramLink />
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function SearchForm({ placeholder, className, onSubmit }: { placeholder: string; className?: string; onSubmit?: () => void }) {
  return <form action="/search" method="get" onSubmit={onSubmit} className={clsx("h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100", className)}><input name="q" type="search" required aria-label={placeholder} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-500" /><button type="submit" aria-label={placeholder} className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-blue-600 hover:bg-blue-100"><Search size={16} /></button></form>;
}
