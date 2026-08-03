"use client";

import { useEffect, useState } from "react";

type LocalDateTimeProps = {
  value: string;
  mode?: "desktop" | "mobile" | "time";
};

export function LocalDateTime({ value, mode = "desktop" }: LocalDateTimeProps) {
  const [label, setLabel] = useState("--");

  useEffect(() => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      setLabel("-");
      return;
    }

    const options: Intl.DateTimeFormatOptions = mode === "time"
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : mode === "mobile"
        ? { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }
        : { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false };

    setLabel(new Intl.DateTimeFormat("ko-KR", options).format(date));
  }, [mode, value]);

  return <time dateTime={value} suppressHydrationWarning>{label}</time>;
}
