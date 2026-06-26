import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Crown,
  Rocket,
  Star,
  TrendingUp,
  Users,
  Eye,
  Target,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/promouvoir")({
  head: () => ({
    meta: [
      { title: "Espace Pro — Tonight Fribourg" },
      {
        name: "description",
        content:
          "Mettez votre bar, club ou événement en avant à Fribourg, Bulle et Lausanne. Formules de visibilité dès 0 CHF.",
      },
      { property: "og:title", content: "Espace Pro — Tonight Fribourg" },
      {
        property: "og:description",
        content:
          "Touchez les noctambules de Suisse romande. Placement prioritaire, badge sponsorisé, statistiques.",
      },
    ],
  }),
  component: PromouvoirPage,
});

const CONTACT_EMAIL = "tonightfribourg@proton.me";

type PlanId = "starter" | "boost" | "premium";
type CityId = "Fribourg" | "Bulle" | "Lausanne" | "Autre";

const PLANS: {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  tagline: string;
  icon: typeof Rocket;
  highlight?: boolean;
  features: string[];
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Gratuit",
    period: "à vie",
    tagline: "Lance ton lieu sur Tonight",
    icon: Star,
    features: [
      "Fiche établissement publique",
      "Jusqu'à 4 événements / mois",
      "Présence sur la carte",
      "Support email",
    ],
  },
  {
    id: "boost",
    name: "Boost",
    price: "49",
    period: "CHF / mois",
    tagline: "Pour les lieux actifs",
    icon: Rocket,
    highlight: true,
    features: [
      "Événements illimités",
      "Placement prioritaire dans le feed",
      "Badge « Recommandé »",
      "Statistiques de vues & clics",
      "Support prioritaire",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "149",
    period: "CHF / mois",
    tagline: "Visibilité maximale",
    icon: Crown,
    features: [
      "Tout du plan Boost",
      "Badge doré « Sponsorisé »",
      "Tête de liste garantie",
      "Mise en avant dans le hero",
      "Story Instagram mensuelle",
      "Account manager dédié",
    ],
  },
];

const BENEFITS = [
  { icon: Users, n: "12k+", t: "noctambules actifs / mois en Romandie" },
  { icon: Eye, n: "85k", t: "vues d'événements ce trimestre" },
  { icon: TrendingUp, n: "+38%", t: "de croissance mensuelle" },
  { icon: Target, n: "18-35", t: "ans, cœur de cible nightlife" },
];

const FAQ = [
  {
    q: "Combien de temps pour publier mon premier événement ?",
    a: "Moins de 5 minutes. On crée ton compte lieu, tu valides ton premier événement, il est en ligne immédiatement.",
  },
  {
    q: "Je peux annuler quand ?",
    a: "Sans engagement. Tu peux passer au plan supérieur, redescendre ou arrêter à tout moment depuis ton espace.",
  },
  {
    q: "Vous facturez en CHF ou en EUR ?",
    a: "En CHF, avec facture pour la comptabilité Suisse. Paiement par carte ou virement.",
  },
  {
    q: "Vous couvrez quelles villes ?",
    a: "Fribourg, Bulle, Lausanne aujourd'hui. Genève, Neuchâtel et Bienne arrivent début 2026.",
  },
];

function PromouvoirPage() {
  const [plan, setPlan] = useState<PlanId>("boost");
  const [city, setCity] = useState<CityId>("Fribourg");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    venue: "",
    name: "",
    email: "",
    phone: "",
    event: "",
    message: "",
  });

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("promo_requests").insert({
      venue: form.venue,
      contact_name: form.name,
      email: form.email,
      phone: form.phone || null,
      event_name: form.event || null,
      message: form.message || null,
      plan,
      city,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez ou écrivez-nous directement.");
      return;
    }
    setSuccess(true);
    toast.success("Demande envoyée ! On revient vers toi sous 24h.");
    setForm({ venue: "", name: "", email: "", phone: "", event: "", message: "" });
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
          <Link
            to="/"
            className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-surface-elevated"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-display text-base font-semibold">Espace Pro</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 via-fuchsia-500/10 to-transparent p-6 mt-6 sm:p-10">
          <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Sparkles className="h-3.5 w-3.5" /> Espace partenaires
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Remplis ton lieu.{" "}
              <span className="bg-gradient-to-r from-amber-300 via-fuchsia-400 to-primary bg-clip-text text-transparent">
                Tous les soirs.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-foreground/80">
              Tonight Fribourg est l'app de référence pour la vie nocturne en Suisse romande.
              Touche directement les noctambules qui cherchent où sortir <strong>ce soir</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#plans"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-bold text-amber-950 shadow-lg shadow-amber-500/30 transition-transform hover:scale-105"
              >
                Voir les formules
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold hover:bg-surface-elevated"
              >
                Parler à l'équipe
              </a>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.t} className="rounded-2xl glass p-4">
              <b.icon className="h-4 w-4 text-amber-300" />
              <div className="mt-2 font-display text-2xl font-bold">{b.n}</div>
              <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{b.t}</p>
            </div>
          ))}
        </section>

        {/* PLANS */}
        <section id="plans" className="mt-12">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Choisis ta formule</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sans engagement. Tu changes ou tu arrêtes quand tu veux.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PLANS.map((p) => {
              const Icon = p.icon;
              const active = plan === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`relative text-left rounded-2xl border p-5 transition-all ${
                    active
                      ? "border-amber-400/70 bg-gradient-to-br from-amber-400/15 to-transparent shadow-lg shadow-amber-500/10 scale-[1.02]"
                      : "border-border/40 glass hover:border-border"
                  }`}
                >
                  {p.highlight && (
                    <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Populaire
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${active ? "text-amber-300" : "text-muted-foreground"}`} />
                    <span className="font-display text-lg font-bold">{p.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-bold">{p.price}</span>
                    <span className="text-xs text-muted-foreground">{p.period}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </section>

        {/* FORM */}
        <section id="contact" className="mt-12">
          <div className="rounded-3xl border border-border/40 bg-gradient-to-br from-surface to-background p-6 sm:p-8">
            {success ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold">Demande reçue 🎉</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  On revient vers toi sous 24h ouvrées avec une proposition adaptée à ton lieu.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full glass px-5 py-2.5 text-sm font-semibold hover:bg-surface-elevated"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold">Demande de devis</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Formule sélectionnée :{" "}
                    <span className="font-semibold text-amber-300">
                      {PLANS.find((p) => p.id === plan)?.name}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Ville</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(["Fribourg", "Bulle", "Lausanne", "Autre"] as CityId[]).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setCity(c)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          city === c
                            ? "bg-foreground text-background"
                            : "glass hover:bg-surface-elevated"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Établissement *" value={form.venue} onChange={onChange("venue")} required maxLength={120} />
                  <Field label="Votre nom *" value={form.name} onChange={onChange("name")} required maxLength={100} />
                  <Field label="Email *" type="email" value={form.email} onChange={onChange("email")} required maxLength={160} />
                  <Field label="Téléphone" type="tel" value={form.phone} onChange={onChange("phone")} maxLength={40} />
                </div>
                <Field
                  label="Nom de l'événement (optionnel)"
                  value={form.event}
                  onChange={onChange("event")}
                  maxLength={160}
                />
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Message</span>
                  <textarea
                    value={form.message}
                    onChange={onChange("message")}
                    maxLength={2000}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
                    placeholder="Date, type de mise en avant souhaitée, budget…"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3.5 text-sm font-bold text-amber-950 shadow-lg shadow-amber-500/30 transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Envoi…
                    </>
                  ) : (
                    "Envoyer ma demande"
                  )}
                </button>
                <p className="text-center text-[11px] text-muted-foreground">
                  Ou écris-nous à{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </form>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Questions fréquentes</h2>
          <div className="mt-4 grid gap-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl glass p-4 transition-colors open:bg-surface-elevated"
              >
                <summary className="cursor-pointer list-none text-sm font-semibold flex items-center justify-between">
                  {item.q}
                  <span className="text-amber-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className="mt-1 w-full rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
      />
    </label>
  );
}
