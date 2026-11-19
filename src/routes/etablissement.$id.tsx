import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Shirt, ShieldCheck, Wine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/etablissement/$id")({
  head: ({ params }) => pageHead(`/etablissement/${params.id}`, "Établissement — Tonight FR", "Règles maison, infos pratiques et prochaines soirées de l'établissement sur Tonight FR."),
  component: VenuePage,
});

function VenuePage() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["venue-public", id],
    queryFn: async () => {
      const { data: venue, error } = await supabase
        .from("venues")
        .select("id,name,city,canton,min_age,dress_code,cloakroom,vip_rules,table_min_spend,owner_id")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!venue) return null;
      const { data: events } = await supabase
        .from("events")
        .select("id,title,starts_at,category,price_text")
        .eq("owner_id", venue.owner_id)
        .gte("starts_at", new Date(Date.now() - 6 * 3600e3).toISOString())
        .order("starts_at", { ascending: true });
      return { venue, events: events ?? [] };
    },
  });

  if (q.isLoading) return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>;
  if (q.isError) return <div className="p-8 text-sm text-destructive">Impossible de charger cet établissement.</div>;
  if (!q.data) return <div className="p-8 text-sm text-muted-foreground">Établissement introuvable. <Link to="/explore" className="text-primary underline">Explorer</Link></div>;
  const { venue: v, events } = q.data;
  const fmt = (d: string) => new Date(d).toLocaleString("fr-CH", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-6">
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Retour</Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">{v.name}</h1>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {[v.city, v.canton].filter(Boolean).join(" · ") || "Lieu à préciser"}</p>

      <section className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-surface-elevated p-3"><ShieldCheck className="h-4 w-4 text-primary" /><p className="mt-1 font-semibold">{v.min_age}+</p><p className="text-xs text-muted-foreground">Âge minimum</p></div>
        <div className="rounded-xl bg-surface-elevated p-3"><Shirt className="h-4 w-4 text-primary" /><p className="mt-1 font-semibold">{v.dress_code || "Libre"}</p><p className="text-xs text-muted-foreground">Dress code</p></div>
        {v.cloakroom && <div className="rounded-xl bg-surface-elevated p-3"><p className="font-semibold">{v.cloakroom}</p><p className="text-xs text-muted-foreground">Vestiaire</p></div>}
        {v.table_min_spend && <div className="rounded-xl bg-surface-elevated p-3"><Wine className="h-4 w-4 text-primary" /><p className="mt-1 font-semibold">{v.table_min_spend}</p><p className="text-xs text-muted-foreground">Minimum table (payé sur place)</p></div>}
      </section>
      {v.vip_rules && <p className="mt-4 rounded-xl border border-border p-3 text-sm">{v.vip_rules}</p>}

      <section className="mt-8">
        <h2 className="font-semibold">Prochaines soirées</h2>
        {events.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Aucune soirée annoncée pour le moment.</p>}
        <ul className="mt-3 space-y-2">
          {events.map((e) => (
            <li key={e.id}>
              <Link to="/event/$id" params={{ id: e.id }} className="press block rounded-xl border border-border p-3">
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">{fmt(e.starts_at)} · {e.category}{e.price_text ? ` · ${e.price_text}` : ""}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
