// Pure helpers for the monthly agenda (Europe/Zurich).
export const TZ = "Europe/Zurich";

/** YYYY-MM-DD key of a date in Zurich time. */
export function zurichDayKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Calendar grid (Monday first) for a month; null = padding cell. */
export function monthGrid(year: number, month0: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month0, 1));
  const days = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${year}-${String(month0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

/** Validates a club-submitted event start: must be a real date in the future. */
export function isValidFutureStart(value: string, now = new Date()): boolean {
  const t = new Date(value).getTime();
  return Number.isFinite(t) && t > now.getTime();
}
