export function gameDetailHref(id: string) {
  return `/games/${encodeURIComponent(id)}`;
}

export function decodeRouteId(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
