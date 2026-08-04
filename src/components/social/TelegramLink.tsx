import { siTelegram } from "simple-icons";

export const TELEGRAM_URL = "https://t.me/SH_AIpickster";

export function TelegramLink({ className = "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" }: { className?: string }) {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Telegram"
      title="Telegram"
      className={className}
    >
      <svg role="img" viewBox="0 0 24 24" aria-hidden="true" className="h-[46%] w-[46%] fill-current">
        <path d={siTelegram.path} />
      </svg>
    </a>
  );
}
