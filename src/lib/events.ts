import { supabase } from "@/integrations/supabase/client";
import type { CategoryKey } from "@/data/events";

export type DbEvent = {
  id: string;
  title: string;
  venue: string;
  area: string;
  category: CategoryKey;
  starts_at: string;
  image_key: string;
  price_text: string | null;
  description: string | null;
  lineup: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  ticket_url: string | null;
  is_promoted?: boolean | null;
  promoted_until?: string | null;
};

function isActivePromo(e: DbEvent): boolean {
  if (!e.is_promoted) return false;
  if (!e.promoted_until) return true;
  return new Date(e.promoted_until).getTime() > Date.now();
}

export type WhenFilter = "tonight" | "tomorrow" | "weekend" | "all";

function rangeFor(when: WhenFilter): { from: Date; to: Date } | null {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (when === "tonight") {
    // From now until tomorrow 06:00 (covers late nights)
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    end.setHours(6, 0, 0, 0);
    return { from: now, to: end };
  }
  if (when === "tomorrow") {
    const from = new Date(start);
    from.setDate(from.getDate() + 1);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    to.setHours(6, 0, 0, 0);
    return { from, to };
  }
  if (when === "weekend") {
    // Find upcoming Fri 17:00 → Mon 06:00
    const day = now.getDay(); // 0=Sun..6=Sat
    const from = new Date(start);
    if (day === 0) {
      // Sunday — show today only as tail of weekend
      from.setHours(0, 0, 0, 0);
    } else if (day === 6) {
      from.setHours(0, 0, 0, 0);
    } else {
      const daysToFri = (5 - day + 7) % 7;
      from.setDate(from.getDate() + daysToFri);
      from.setHours(17, 0, 0, 0);
    }
    const to = new Date(start);
    const daysToMon = (8 - day) % 7 || 7;
    to.setDate(to.getDate() + daysToMon);
    to.setHours(6, 0, 0, 0);
    return { from, to };
  }
  return null;
}

export type CityFilter = "all" | "Fribourg" | "Bulle" | "Lausanne";

export async function fetchEvents(opts: {
  when: WhenFilter;
  category: CategoryKey | "all";
  city?: CityFilter;
}): Promise<DbEvent[]> {
  let q = supabase.from("events").select("*").order("starts_at", { ascending: true });
  const range = rangeFor(opts.when);
  if (range) {
    q = q.gte("starts_at", range.from.toISOString()).lt("starts_at", range.to.toISOString());
  } else {
    // "all" = upcoming only — exclude past events (with 6h grace for ongoing nights)
    const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    q = q.gte("starts_at", cutoff);
  }
  if (opts.category !== "all") {
    q = q.eq("category", opts.category);
  }
  if (opts.city && opts.city !== "all") {
    q = q.eq("area", opts.city);
  }
  const { data, error } = await q;
  if (error) throw error;
  const list = (data ?? []) as DbEvent[];
  return list.slice().sort((a, b) => {
    const ap = isActivePromo(a) ? 1 : 0;
    const bp = isActivePromo(b) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();
  });
}

export async function fetchEventById(id: string): Promise<DbEvent | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as DbEvent) ?? null;
}
