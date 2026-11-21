import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type CategoryKey } from "@/data/events";
import { isValidFutureStart } from "@/lib/agenda";

type Props = { userId: string; venue: { name: string; city: string } | null };

/** Lets a club owner publish its own event, attached to its venue (no invented dates). */
export function PublishEventForm({ userId, venue }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", starts_at: "", category: "clubbing" as CategoryKey, price_text: "", lineup: "", description: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const field = "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm";

  if (!venue?.name) {
    return <p className="mt-5 rounded-xl border border-border p-4 text-sm text-muted-foreground">Enregistrez d'abord votre fiche établissement (plus bas) pour pouvoir publier vos soirées.</p>;
  }
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="press mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
        <Plus className="h-4 w-4" /> Publier une soirée
      </button>
    );
  }

  const submit = async () => {
    setMsg(null);
    if (f.title.trim().length < 2) return setMsg("Indiquez un titre.");
    if (!isValidFutureStart(f.starts_at)) return setMsg("Choisissez une date et une heure à venir.");
    setBusy(true);
    const { error } = await supabase.from("events").insert({
      title: f.title.trim().slice(0, 140), venue: venue.name, area: venue.city || "Fribourg",
      category: f.category, image_key: f.category, starts_at: new Date(f.starts_at).toISOString(),
      price_text: f.price_text.trim() || null, lineup: f.lineup.trim() || null,
      description: f.description.trim() || null, owner_id: userId,
    });
    setBusy(false);
    if (error) {
      setMsg(error.code === "42501" ? "Votre compte n'est pas encore validé comme établissement. Contactez l'équipe Tonight." : "Erreur : " + error.message);
      return;
    }
    setMsg("Soirée publiée ✓ Elle apparaît dans l'agenda.");
    setF({ ...f, title: "", starts_at: "", lineup: "", description: "", price_text: "" });
    qc.invalidateQueries({ queryKey: ["venue-requests"] });
    qc.invalidateQueries({ queryKey: ["agenda-public"] });
    qc.invalidateQueries({ queryKey: ["soirees-public"] });
  };

  return (
    <section className="mt-5 rounded-2xl border border-primary/40 bg-surface/60 p-5">
      <h2 className="font-semibold">Nouvelle soirée · {venue.name}</h2>
      <div className="mt-4 space-y-3 text-sm">
        <label className="block">Titre<input className={field} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
        <label className="block">Date et heure de début<input type="datetime-local" className={field} value={f.starts_at} onChange={(e) => setF({ ...f, starts_at: e.target.value })} /></label>
        <label className="block">Style
          <select className={field} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as CategoryKey })}>
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label.fr}</option>)}
          </select>
        </label>
        <label className="block">Prix (ex. « 15 CHF », « Gratuit avant minuit »)<input className={field} value={f.price_text} onChange={(e) => setF({ ...f, price_text: e.target.value })} /></label>
        <label className="block">DJ / Line-up<input className={field} value={f.lineup} onChange={(e) => setF({ ...f, lineup: e.target.value })} /></label>
        <label className="block">Description<textarea rows={3} className={field} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
        <p className="text-xs text-muted-foreground">Le dress code et l'âge minimum de votre fiche s'affichent automatiquement.</p>
        {msg && <p className="text-xs text-primary">{msg}</p>}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setOpen(false)} className="press h-11 rounded-xl border border-border text-sm">Fermer</button>
          <button disabled={busy} onClick={submit} className="press h-11 rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Publication…" : "Publier"}</button>
        </div>
      </div>
    </section>
  );
}
