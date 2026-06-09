export const formatCurrency = (value: number) => `${Math.round(value).toLocaleString("en-US")} SHC`;

export const formatSignedCurrency = (value: number) =>
  `${value > 0 ? "+" : value < 0 ? "-" : ""}${formatCurrency(Math.abs(value))}`;

export const formatPercent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatDate = (value: string) => {
  const { month, day } = getDateTimeParts(value);
  return `${Number(month)}월 ${Number(day)}일`;
};

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

  if (sport === "배구" || sport === "e스포츠") {
    return `${total}세트`;
  }

  return `${total}점`;
};
