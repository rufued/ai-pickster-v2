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

export const formatDateTime = (value: string, mode: "desktop" | "mobile" = "desktop") => {
  const { year, month, day, hour, minute } = getDateTimeParts(value);

  if (mode === "mobile") {
    return `${month}.${day} ${hour}:${minute}`;
  }

  return `${year}.${month}.${day} ${hour}:${minute}`;
};

export const formatTime = (value: string) => {
  const { hour, minute } = getDateTimeParts(value);

  return `${hour}:${minute}`;
};

function getDateTimeParts(value: string) {
  const trimmedValue = value.trim();
  const isoMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  const spacedMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
  const match = isoMatch ?? spacedMatch;

  if (match) {
    return {
      year: match[1],
      month: match[2],
      day: match[3],
      hour: match[4],
      minute: match[5],
    };
  }

  return {
    year: "0000",
    month: "00",
    day: "00",
    hour: "00",
    minute: "00",
  };
}

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
