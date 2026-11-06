import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, X, UserCheck, UserX, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CANTONS } from "@/data/cantons";

export const Route = createFileRoute("/pro")({
  head: () => ({
    meta: [
      { title: "Espace Pro — Tonight Suisse" },
      { name: "description", content: "Gérez votre établissement, ses règles maison et ses demandes de tables VIP." },
      { property: "og:title", content: "Espace Pro — Tonight Suisse" },
      { property: "og:description", content: "Gérez votre établissement, ses règles maison et ses demandes de tables VIP." },
      { property: "og:url", content: "https://tonightfr.lovable.app/pro" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Espace Pro — Tonight Suisse" },
      { name: "twitter:description", content: "Gérez votre établissement, ses règles maison et ses demandes de tables VIP." },
    ],
    links: [{ rel: "canonical", href: "https://tonightfr.lovable.app/pro" }],
  }),
  component: ProPage,
});

type Venue = {
  id?: string; name: string; city: string; canton: string; min_age: number;
  dress_code: string | null; cloakroom: string | null; vip_rules: string | null; table_min_spend: string | null;
};
const empty: Venue = { name: "", city: "", canton: "", min_age: 18, dress_code: "", cloakroom: "", vip_rules: "", table_min_spend: "" };

const STATUS: Record<string, string> = { pending: "En attente", accepted: "Acceptée", refused: "Refusée", arrived: "Venus", no_show: "Absents" };

function ProPage() {
  const { user, loading } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState<Venue>(empty);
  const [msg, setMsg] = useState<string | null>(null);

  const venueQ = useQuery({
    queryKey: ["my-venue", user?.id], enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("venues").select("*").eq("owner_id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => { if (venueQ.data) setForm({ ...empty, ...venueQ.data }); }, [venueQ.data]);

  const reqQ = useQuery({
    queryKey: ["venue-requests", user?.id], enabled: !!user,
    queryFn: async () => {
      const { data: evs } = await supabase.from("events").select("id,title,starts_at").eq("owner_id", user!.id);
      const ids = (evs ?? []).map((e) => e.id);
      if (!ids.length) return { events: [], requests: [] };
      const { data, error } = await supabase.from("table_requests").select("*").in("event_id", ids).order("created_at", { ascending: false });
      if (error) throw error;
      return { events: evs ?? [], requests: data ?? [] };
    },
  });

  if (loading) return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>;
  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-5 pt-10">
        <Building2 className="h-8 w-8 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold">Espace Pro</h1>
        <p className="mt-3 text-sm text-muted-foreground">Clubs, bars, rooftops et restaurants : créez votre fiche, fixez vos règles maison et recevez les demandes de tables VIP. Les consommations sont payées directement chez vous.</p>
        <Link to="/auth" className="press mt-6 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">Se connecter / créer mon compte</Link>
      </main>
    );
  }

  const save = async () => {
    setMsg(null);
    const payload = { ...form, owner_id: user.id, name: form.name.trim() };
    delete (payload as { id?: string }).id;
    const { error } = form.id
      ? await supabase.from("venues").update(payload).eq("id", form.id)
      : await supabase.from("venues").insert(payload);
    setMsg(error ? "Erreur : " + error.message : "Fiche enregistrée ✓");
    qc.invalidateQueries({ queryKey: ["my-venue"] });
  };

  const setStatus = async (id: string, status: string) => {
    await supabase.from("table_requests").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["venue-requests"] });
  };

  const reqs = reqQ.data?.requests ?? [];
  const evTitle = (id: string) => reqQ.data?.events.find((e) => e.id === id)?.title ?? "Soirée";
  const count = (s: string) => reqs.filter((r) => r.status === s).length;
  const guestsIn = reqs.filter((r) => r.status === "arrived").reduce((a, r) => a + r.guests, 0);

  const field = "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm";

  return (
    <main className="mx-auto max-w-xl px-5 pb-24 pt-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Retour</Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">Espace Pro</h1>

      <section className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
        <h2 className="font-semibold">Bilan de vos soirées</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          {[["Demandes", reqs.length], ["Acceptées", count("accepted") + count("arrived")], ["Tables venues", count("arrived")], ["Clients amenés", guestsIn]].map(([l, v]) => (
            <div key={l as string} className="rounded-xl bg-surface-elevated p-3">
              <p className="text-2xl font-semibold tabular-nums text-primary">{v}</p>
              <p className="text-xs text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
        <h2 className="font-semibold">Carnet des tables VIP</h2>
        <p className="mt-1 text-xs text-muted-foreground">Le client paie ses consommations directement chez vous.</p>
        {reqs.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Aucune demande pour l'instant. Publiez une soirée depuis votre espace événements.</p>}
        <ul className="mt-4 space-y-3">
          {reqs.map((r) => (
            <li key={r.id} className="rounded-xl border border-border p-3 text-sm">
              <div className="flex justify-between gap-2">
                <span className="font-medium">{r.contact_name} · {r.guests} pers.</span>
                <span className="text-xs text-primary">{STATUS[r.status] ?? r.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">{evTitle(r.event_id)} · {r.zone} · {r.phone}</p>
              {r.note && <p className="mt-1 text-xs">« {r.note} »</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                {r.status === "pending" && <>
                  <button onClick={() => setStatus(r.id, "accepted")} className="press inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><Check className="h-3 w-3" /> Accepter</button>
                  <button onClick={() => setStatus(r.id, "refused")} className="press inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs"><X className="h-3 w-3" /> Refuser</button>
                </>}
                {r.status === "accepted" && <>
                  <button onClick={() => setStatus(r.id, "arrived")} className="press inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"><UserCheck className="h-3 w-3" /> Arrivés</button>
                  <button onClick={() => setStatus(r.id, "no_show")} className="press inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs"><UserX className="h-3 w-3" /> Absents</button>
                </>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
        <h2 className="font-semibold">Fiche établissement & règles maison</h2>
        <div className="mt-4 space-y-3 text-sm">
          <label className="block">Nom<input className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label className="block">Ville<input className={field} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label>
          <label className="block">Canton
            <select className={field} value={form.canton} onChange={(e) => setForm({ ...form, canton: e.target.value })}>
              <option value="">Choisir…</option>
              {CANTONS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">Âge minimum
            <select className={field} value={form.min_age} onChange={(e) => setForm({ ...form, min_age: Number(e.target.value) })}>
              <option value={16}>16+</option><option value={18}>18+</option><option value={21}>21+</option>
            </select>
          </label>
          <label className="block">Dress code<input className={field} value={form.dress_code ?? ""} onChange={(e) => setForm({ ...form, dress_code: e.target.value })} placeholder="Ex. Chic, pas de baskets" /></label>
          <label className="block">Vestiaire<input className={field} value={form.cloakroom ?? ""} onChange={(e) => setForm({ ...form, cloakroom: e.target.value })} placeholder="Ex. 3 CHF, inclus avec table VIP" /></label>
          <label className="block">Minimum de consommation table<input className={field} value={form.table_min_spend ?? ""} onChange={(e) => setForm({ ...form, table_min_spend: e.target.value })} placeholder="Ex. 300 CHF, payé sur place" /></label>
          <label className="block">Règles VIP (shots, bouteilles…)<textarea className={field} rows={3} value={form.vip_rules ?? ""} onChange={(e) => setForm({ ...form, vip_rules: e.target.value })} /></label>
          <button onClick={save} disabled={!form.name.trim()} className="press h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-50">Enregistrer</button>
          {msg && <p className="text-xs text-muted-foreground" aria-live="polite">{msg}</p>}
          <Link to="/admin" className="block text-center text-xs text-primary underline">Gérer mes soirées</Link>
        </div>
      </section>
    </main>
  );
}
