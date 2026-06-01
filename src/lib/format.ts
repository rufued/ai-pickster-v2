export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatSignedCurrency = (value: number) =>
  `${value > 0 ? "+" : ""}${formatCurrency(value)}`;

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(value.replace(" ", "T")));

export const formatTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value.replace(" ", "T")));
