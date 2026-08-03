"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/I18nProvider";
import { getAdForPlacement } from "@/services/scorehub";
import type { Ad, AdPlacement } from "@/data/ads";

export function AdPlaceholder({ placement, className = "" }: { placement: AdPlacement; className?: string }) {
  const { t } = useI18n();
  return (
    <aside
      className={`flex min-h-20 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-center ${className}`}
      aria-label={t("ads.area")}
      data-ad-placement={placement}
    >
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Advertisement</span>
        <p className="mt-1 text-xs font-bold text-slate-400">{t("ads.area")}</p>
      </div>
    </aside>
  );
}

export function AdSlot({ placement }: { placement: AdPlacement }) {
  const ad = getAdForPlacement(placement);

  if (!ad) {
    return null;
  }

  if (ad.type === "image" && ad.imageUrl) {
    // Ad image dimensions are provider-managed, so this stays as a plain image fallback.
    // eslint-disable-next-line @next/next/no-img-element
    const image = <img src={ad.imageUrl} alt={ad.title} className="h-auto w-full rounded-md border border-slate-200" />;
    return ad.href || ad.targetUrl ? <Link href={ad.href ?? ad.targetUrl ?? "#"}>{image}</Link> : image;
  }

  if (ad.type === "internal") {
    return <AdBanner ad={ad} />;
  }

  return null;
}

function AdBanner({ ad }: { ad: Ad }) {
  const { t } = useI18n();
  const href = ad.targetUrl ?? ad.href ?? "#";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label={ad.name ?? ad.title}>
      <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-black uppercase text-slate-500">
          {t("ads.label")}
        </span>
        <div className="min-w-0">
          <p className="text-base font-black text-slate-950">{ad.title}</p>
          {ad.subtitle ? <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{ad.subtitle}</p> : null}
        </div>
        <Link href={href} className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-blue-700">
          {ad.buttonText ?? t("ads.contact")}
        </Link>
      </div>
    </aside>
  );
}
