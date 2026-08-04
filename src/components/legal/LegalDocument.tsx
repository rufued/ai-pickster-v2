import type { ReactNode } from "react";
import { DashboardShell } from "@/components/scorehub/ScorehubPrimitives";

export type LegalSection = { heading: string; body: ReactNode };

export function LegalDocument({
  title,
  eyebrow,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  eyebrow: string;
  lastUpdated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <DashboardShell title={title} eyebrow={eyebrow} description={`Last updated: ${lastUpdated}`}>
      <article className="panel space-y-8 p-5 sm:p-8">
        {intro ? <div className="space-y-3 text-sm font-medium leading-7 text-slate-700">{intro}</div> : null}
        {sections.map((section, index) => (
          <section key={index} className="space-y-3 border-t border-slate-100 pt-6 first:border-t-0 first:pt-0">
            <h2 className="text-lg font-black text-slate-950">{section.heading}</h2>
            <div className="space-y-3 text-sm font-medium leading-7 text-slate-700">{section.body}</div>
          </section>
        ))}
      </article>
    </DashboardShell>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );
}

export function LegalLabel({ children }: { children: ReactNode }) {
  return <p className="font-black text-slate-900">{children}</p>;
}
