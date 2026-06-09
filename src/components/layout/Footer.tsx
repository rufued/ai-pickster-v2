import { SCOREHUB } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container-shell flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-700">{SCOREHUB.name}</p>
        <p>{SCOREHUB.description}</p>
      </div>
    </footer>
  );
}
