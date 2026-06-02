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
    timeZone: "Asia/Seoul",
  }).format(new Date(value.replace(" ", "T")));

export const formatTime = (value: string) => {
  const timePart = value.trim().split(" ")[1] ?? value.trim().split("T")[1] ?? "";
  const [hour = "00", minute = "00"] = timePart.split(":");

  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

export const formatPredictedTotal = (sport: string, total?: number) => {
  if (total === undefined) {
    return null;
  }

  if (sport === "축구") {
    return `${total}골`;
  }

  if (sport === "테니스" || sport === "e스포츠") {
    return `${total}세트`;
  }

  return `${total}점`;
};
