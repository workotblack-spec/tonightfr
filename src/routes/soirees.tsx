import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin, Shirt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/page-head";
import { motion } from "motion/react";

const soireesQuery = queryOptions({
  queryKey: ["soirees-public"],
  queryFn: async () => {
    const { data: events, error } = await supabase
      .from("events")
      .select("id,title,venue,area,category,starts_at,price_text,owner_id")
      .gte("starts_at", new Date(Date.now() - 6 * 3600e3).toISOString())
      .order("starts_at", { ascending: true })
      .limit(200);
    if (error) throw error;
    const owners = [...new Set((events ?? []).map((e) => e.owner_id).filter(Boolean))] as string[];
    const venues = owners.length
      ? (await supabase.from("venues").select("id,owner_id,name,dress_code,min_age").in("owner_id", owners)).data ?? []
      : [];
    return (events ?? []).map((e) => ({ ...e, place: venues.find((v) => v.owner_id === e.owner_id) ?? null }));
  },
});

export const Route = createFileRoute("/soirees")({
  head: () => pageHead("/soirees", "Toutes les soirées — Tonight FR", "Agenda des soirées publiées à Fribourg et en Suisse romande : dates, horaires, établissements et dress code."),
  loader: ({ context }) => context.queryClient.ensureQueryData(soireesQuery),
  component: SoireesPage,
  errorComponent: () => <div className="p-8 text-sm text-destructive">Impossible de charger les soirées.</div>,
  notFoundComponent: () => <div className="p-8 text-sm text-muted-foreground">Aucune soirée.</div>,
});

const tz = "Europe/Zurich";
const day = (d: string) => new Date(d).toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long", timeZone: tz });
const hour = (d: string) => new Date(d).toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit", timeZone: tz });

function SoireesPage() {
  const { data } = useSuspenseQuery(soireesQuery);
  const groups = new Map<string, typeof data>();
  for (const e of data) groups.set(day(e.starts_at), [...(groups.get(day(e.starts_at)) ?? []), e]);

  return (
    <div className="relative min-h-screen pb-28">
      <div className="night-aurora" aria-hidden />
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="neon-text font-display text-3xl font-semibold tracking-tight">Soirées</motion.h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Toutes les soirées à venir, avec horaires et dress code.</p>
          <Link to="/agenda" className="mt-2 inline-block text-xs font-medium text-primary underline">Voir le calendrier du mois</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl space-y-8 px-5 pt-5">
        {data.length === 0 && <p className="text-sm text-muted-foreground">Aucune soirée annoncée pour le moment. Revenez bientôt !</p>}
        {[...groups].map(([d, list]) => (
          <section key={d}>
            <h2 className="flex items-center gap-2 text-sm font-semibold capitalize text-primary"><span className="neon-dot h-1.5 w-1.5 rounded-full" /><CalendarDays className="h-4 w-4" /> <span className="neon-gradient-text">{d}</span></h2>
            <ul className="mt-3 space-y-3">
              {list.map((e, i) => (
                <motion.li key={e.id} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/event/$id" params={{ id: e.id }} className="smoked block rounded-2xl p-4">
                    <p className="font-semibold">{e.title}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {hour(e.starts_at)}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {e.place?.name ?? e.venue} · {e.area}</span>
                      <span className="inline-flex items-center gap-1"><Shirt className="h-3.5 w-3.5" /> {e.place?.dress_code || "Dress code libre"}</span>
                      {e.place && <span>{e.place.min_age}+</span>}
                      {e.price_text && <span>{e.price_text}</span>}
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
