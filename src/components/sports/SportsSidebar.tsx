"use client";

import Link from "next/link";
import clsx from "clsx";
import { sportCategories } from "@/lib/sports";

type SportsSidebarProps = {
  basePath?: string;
  activeSport?: string;
  onSportChange?: (sportId: string) => void;
};

export function SportsSidebar({ basePath = "/", activeSport = "all", onSportChange }: SportsSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="panel border-accent-green/20 p-3">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">Sports</p>
          <span className="hidden rounded-full border border-accent-green/30 bg-accent-green/10 px-2 py-0.5 text-[10px] font-black text-accent-green lg:inline-flex">
            FILTER
          </span>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {sportCategories.map((category) => {
            const active = activeSport === category.id || (!activeSport && category.id === "all");
            const href = category.id === "all" ? basePath : `${basePath}?sport=${category.id}`;
            const className = clsx(
              "flex min-w-max items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold transition lg:min-w-0 lg:justify-start",
              active
                ? "border-accent-green bg-accent-green text-black shadow-[0_0_18px_rgba(34,197,94,0.18)]"
                : "border-white/10 bg-black/20 text-slate-300 hover:border-accent-green/40 hover:text-white",
            );
            const content = (
              <>
                <span aria-hidden>{category.icon}</span>
                <span>{category.label}</span>
                {category.isNew ? (
                  <span className={active ? "rounded bg-black/20 px-1.5 py-0.5 text-[10px] text-black" : "rounded bg-accent-green/15 px-1.5 py-0.5 text-[10px] text-accent-green"}>
                    NEW
                  </span>
                ) : null}
              </>
            );

            if (onSportChange) {
              return (
                <button key={category.id} type="button" onClick={() => onSportChange(category.id)} className={className}>
                  {content}
                </button>
              );
            }

            return (
              <Link key={category.id} href={href} className={className}>
                {content}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
