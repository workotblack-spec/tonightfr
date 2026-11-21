import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Shirt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/page-head";
import { BottomNav } from "@/components/tonight/BottomNav";
import { TZ, monthGrid, zurichDayKey } from "@/lib/agenda";

const agendaQuery = queryOptions({
  queryKey: ["agenda-public"],
  queryFn: async () => {
    const { data: events, error } = await supabase
      .from("events")
      .select("id,title,venue,area,starts_at,owner_id")
      .gte("starts_at", new Date(Date.now() - 40 * 86400e3).toISOString())
      .order("starts_at", { ascending: true })
      .limit(500);
    if (error) throw error;
    const owners = [...new Set((events ?? []).map((e) => e.owner_id).filter(Boolean))] as string[];
    const venues = owners.length
      ? (await supabase.from("venues").select("id,owner_id,name,dress_code").in("owner_id", owners)).data ?? []
      : [];
    return (events ?? []).map((e) => ({ ...e, place: venues.find((v) => v.owner_id === e.owner_id) ?? null }));
  },
});

export const Route = createFileRoute("/agenda")({
  head: () => pageHead("/agenda", "Agenda mensuel des soirées — Tonight FR", "Calendrier du mois : chaque soirée avec date, heure, établissement et dress code à Fribourg, Bulle et Lausanne."),
  loader: ({ context }) => context.queryClient.ensureQueryData(agendaQuery),
  component: AgendaPage,
  errorComponent: () => <div className="p-8 text-sm text-destructive">Impossible de charger l'agenda.</div>,
  notFoundComponent: () => <div className="p-8 text-sm text-muted-foreground">Agenda introuvable.</div>,
});

const hour = (d: string) => new Date(d).toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

function AgendaPage() {
  const { data } = useSuspenseQuery(agendaQuery);
  const today = zurichDayKey(new Date());
  const [ym, setYm] = useState(() => ({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) - 1 }));
  const [selected, setSelected] = useState(today);

  const byDay = new Map<string, typeof data>();
  for (const e of data) { const k = zurichDayKey(e.starts_at); byDay.set(k, [...(byDay.get(k) ?? []), e]); }
  const cells = monthGrid(ym.y, ym.m);
  const label = new Date(Date.UTC(ym.y, ym.m, 15)).toLocaleDateString("fr-CH", { month: "long", year: "numeric" });
  const shift = (n: number) => setYm(({ y, m }) => { const t = m + n; return { y: y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 }; });
  const list = byDay.get(selected) ?? [];

  return (
    <div className="min-h-screen pb-28">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Les soirées publiées par les établissements, mois par mois.</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 pt-5">
        <div className="flex items-center justify-between">
          <button aria-label="Mois précédent" onClick={() => shift(-1)} className="press rounded-xl border border-border p-2"><ChevronLeft className="h-4 w-4" /></button>
          <h2 className="font-semibold capitalize">{label}</h2>
          <button aria-label="Mois suivant" onClick={() => shift(1)} className="press rounded-xl border border-border p-2"><ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
          {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((k, i) => {
            if (!k) return <span key={i} />;
            const n = byDay.get(k)?.length ?? 0;
            const sel = k === selected;
            return (
              <button key={k} onClick={() => setSelected(k)} aria-label={`${k}, ${n} soirée(s)`}
                className={`press flex aspect-square flex-col items-center justify-center rounded-xl border text-sm ${sel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface/60"} ${k === today && !sel ? "ring-1 ring-primary" : ""}`}>
                {Number(k.slice(8))}
                {n > 0 && <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${sel ? "bg-primary-foreground" : "bg-primary"}`} />}
              </button>
            );
          })}
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-semibold capitalize text-primary">
            {new Date(`${selected}T12:00:00Z`).toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long", timeZone: TZ })}
          </h3>
          {list.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Aucune soirée publiée ce jour-là.</p>}
          <ul className="mt-3 space-y-3">
            {list.map((e) => (
              <li key={e.id}>
                <Link to="/event/$id" params={{ id: e.id }} className="press block rounded-2xl border border-border bg-surface/60 p-4">
                  <p className="font-semibold">{e.title}</p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{hour(e.starts_at)}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{e.place?.name ?? e.venue} · {e.area}</span>
                    <span className="inline-flex items-center gap-1"><Shirt className="h-3 w-3" />{e.place?.dress_code || "Dress code non précisé"}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <BottomNav lang="fr" />
    </div>
  );
}
