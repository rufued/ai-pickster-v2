"use client";

import clsx from "clsx";
import Link from "next/link";
import { sportCategories } from "@/lib/sports";

type SportsSidebarProps = {
  basePath?: string;
  activeSport?: string;
  onSportChange?: (sportId: string) => void;
};

export function SportsSidebar({ basePath = "/", activeSport = "all", onSportChange }: SportsSidebarProps) {
  return (
    <aside className="min-w-0 max-w-full lg:sticky lg:top-24 lg:self-start">
      <div className="panel max-w-full overflow-hidden p-3 lg:overflow-visible">
        <div className="mb-3 px-1">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Sports</p>
        </div>
        <nav className="scrollbar-hide flex max-w-full gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {sportCategories.map((category) => {
            const active = activeSport === category.id || (!activeSport && category.id === "all");
            const href = category.id === "all" ? basePath : `${basePath}?sport=${category.id}`;
            const className = clsx(
              "group inline-flex h-11 flex-none cursor-pointer touch-manipulation items-center gap-3 whitespace-nowrap rounded-lg border px-3 text-sm transition lg:flex lg:w-full lg:min-w-0 lg:justify-start",
              active
                ? "border-blue-600 bg-blue-600 font-semibold text-white shadow-sm"
                : "border-slate-200 bg-white font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
            );
            const content = (
              <>
                <span
                  aria-hidden
                  className={clsx(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center text-[19px] leading-none transition",
                    active ? "text-white" : "text-slate-600 group-hover:text-blue-600",
                  )}
                >
                  {category.icon}
                </span>
                <span>{category.label}</span>
                {category.isNew ? (
                  <span className={active ? "rounded bg-white/15 px-1.5 py-0.5 text-[10px] text-white" : "rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700"}>
                    NEW
                  </span>
                ) : null}
              </>
            );

            if (onSportChange) {
              return (
                <button key={category.id} type="button" aria-pressed={active} onClick={() => onSportChange(category.id)} className={className}>
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
