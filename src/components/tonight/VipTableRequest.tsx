import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Crown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ZONES = [
  { key: "vip", label: "Carré VIP" },
  { key: "piste", label: "Bord de piste" },
  { key: "mezzanine", label: "Mezzanine" },
  { key: "terrasse", label: "Terrasse" },
];

export function VipTableRequest({ eventId, venue }: { eventId: string; venue: string }) {
  const { user } = useAuth();
  const [zone, setZone] = useState("vip");
  const [guests, setGuests] = useState(4);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || phone.replace(/\D/g, "").length < 6) {
      setErr("Merci d'indiquer un nom et un numéro valide.");
      return;
    }
    setState("sending");
    setErr("");
    const { error } = await supabase.from("table_requests").insert({
      user_id: user.id,
      event_id: eventId,
      zone,
      guests,
      contact_name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      note: note.trim() ? note.trim().slice(0, 500) : null,
    });
    if (error) {
      setState("error");
      setErr("Impossible d'envoyer la demande. Réessayez.");
    } else setState("done");
  };

  return (
    <section className="mt-10 rounded-2xl border border-primary/40 bg-surface/60 p-5">
      <div className="flex items-center gap-2 text-primary">
        <Crown className="h-4 w-4" />
        <p className="label-xs">Réserver une table</p>
      </div>
      <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">Votre place VIP chez {venue}</h2>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        Réservation gratuite via Tonight. Vos consommations et bouteilles se règlent directement sur place
        auprès de l'établissement, selon ses conditions (vestiaire, tenue, heure d'arrivée).
      </p>

      {state === "done" ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/10 p-4 text-sm">
          <Check className="mt-0.5 h-4 w-4 text-primary" />
          <span>Demande envoyée. L'établissement vous confirmera votre table.</span>
        </div>
      ) : !user ? (
        <Link to="/auth" className="press mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">
          Se connecter pour réserver
        </Link>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <button type="button" key={z.key} onClick={() => setZone(z.key)}
                className={`press rounded-full border px-3 py-1.5 text-[12.5px] ${zone === z.key ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                {z.label}
              </button>
            ))}
          </div>
          <label className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Nombre de personnes</span>
            <input type="number" min={1} max={30} value={guests} onChange={(e) => setGuests(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
              className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-right" />
          </label>
          <input placeholder="Nom de la réservation" value={name} onChange={(e) => setName(e.target.value)} maxLength={100}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
          <input placeholder="Téléphone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
          <textarea placeholder="Occasion, heure d'arrivée… (optionnel)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} rows={2}
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={state === "sending"} className="press h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {state === "sending" ? "Envoi…" : "Demander ma table"}
          </button>
        </form>
      )}
    </section>
  );
}
