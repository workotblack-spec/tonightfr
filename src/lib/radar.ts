import type { CategoryKey } from "@/data/events";

export type Moment = "all" | "apero" | "bar" | "live" | "club";
export type Company = "all" | "solo" | "duo" | "bande";
export type Radius = 2 | 15 | 50 | "ch";

export const MOMENTS: { key: Moment; label: string; cats: CategoryKey[] }[] = [
  { key: "all", label: "Tout", cats: [] },
  { key: "apero", label: "Apéro & Rooftop", cats: ["afterwork", "happyhour"] },
  { key: "bar", label: "Bar cocktails", cats: ["lounge", "shisha", "happyhour"] },
  { key: "live", label: "Live & Culture", cats: ["concert", "culture", "sport"] },
  { key: "club", label: "Club", cats: ["clubbing"] },
];

export const COMPANIES: { key: Company; label: string; cats: CategoryKey[] }[] = [
  { key: "all", label: "Peu importe", cats: [] },
  { key: "solo", label: "Solo", cats: ["concert", "culture", "afterwork", "lounge", "sport"] },
  { key: "duo", label: "En duo", cats: ["lounge", "concert", "culture", "happyhour"] },
  { key: "bande", label: "En bande", cats: ["clubbing", "afterwork", "happyhour", "shisha", "sport", "concert"] },
];

export const RADII: { key: Radius; label: string }[] = [
  { key: 2, label: "2 km" },
  { key: 15, label: "15 km" },
  { key: 50, label: "Mon canton" },
  { key: "ch", label: "Toute la Suisse" },
];

export function matchesMood(cat: CategoryKey, moment: Moment, company: Company): boolean {
  const m = MOMENTS.find((x) => x.key === moment)!;
  const c = COMPANIES.find((x) => x.key === company)!;
  if (m.cats.length && !m.cats.includes(cat)) return false;
  if (c.cats.length && !c.cats.includes(cat)) return false;
  return true;
}

export function withinRadius(distance: number | undefined, radius: Radius): boolean {
  if (radius === "ch" || distance === undefined) return true;
  return distance <= radius;
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}
