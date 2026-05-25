import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/promouvoir")({
  head: () => ({
    meta: [
      { title: "Promouvoir mon événement — Tonight.fr" },
      {
        name: "description",
        content:
          "Mettez votre événement en avant sur Tonight.fr. Visibilité prioritaire auprès des noctambules de Fribourg.",
      },
      { property: "og:title", content: "Promouvoir mon événement — Tonight.fr" },
      {
        property: "og:description",
        content:
          "Placement prioritaire, badge sponsorisé doré, visibilité maximale auprès du public nightlife de Fribourg.",
      },
    ],
  }),
  component: PromouvoirPage,
});

const CONTACT_EMAIL = "contact@tonightfr.ch";

function PromouvoirPage() {
  const [form, setForm] = useState({
    venue: "",
    name: "",
    email: "",
    phone: "",
    event: "",
    message: "",
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Promotion — ${form.venue || form.name}`);
    const body = encodeURIComponent(
      [
        `Établissement : ${form.venue}`,
        `Contact : ${form.name}`,
        `Email : ${form.email}`,
        `Téléphone : ${form.phone}`,
        `Événement : ${form.event}`,
        ``,
        form.message,
      ].join("\n"),
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
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
          <span className="font-display text-base font-semibold">Promouvoir</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-8">
        <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 via-amber-500/5 to-transparent p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
            <Sparkles className="h-3.5 w-3.5" /> Sponsorisé
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Faites briller votre soirée <span className="text-amber-300">à Fribourg.</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Placement prioritaire en tête de liste, badge doré « Sponsorisé », et visibilité maximale auprès
            des noctambules qui ouvrent Tonight.fr ce soir.
          </p>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { t: "Tête de liste", d: "Vos événements apparaissent en haut, tous filtres confondus." },
            { t: "Badge doré", d: "Identifié comme partenaire, repérable d'un coup d'œil." },
            { t: "Sans engagement", d: "Mensuel ou par événement, à la carte." },
          ].map((b) => (
            <div key={t(b.t)} className="rounded-2xl glass p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Check className="h-4 w-4 text-amber-300" /> {b.t}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </section>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 rounded-2xl glass p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Demander un devis</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Établissement *" value={form.venue} onChange={onChange("venue")} required maxLength={100} />
            <Field label="Votre nom *" value={form.name} onChange={onChange("name")} required maxLength={80} />
            <Field label="Email *" type="email" value={form.email} onChange={onChange("email")} required maxLength={120} />
            <Field label="Téléphone" type="tel" value={form.phone} onChange={onChange("phone")} maxLength={30} />
          </div>
          <Field
            label="Nom de l'événement (si déjà connu)"
            value={form.event}
            onChange={onChange("event")}
            maxLength={120}
          />
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Message</span>
            <textarea
              value={form.message}
              onChange={onChange("message")}
              maxLength={1000}
              rows={4}
              className="mt-1 w-full rounded-xl border border-border/40 bg-background/50 px-3 py-2 text-sm outline-none focus:border-amber-400/60"
              placeholder="Date, type de mise en avant souhaitée, budget approximatif…"
            />
          </label>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-amber-950 transition-transform hover:scale-[1.02]"
          >
            Envoyer ma demande
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Ou écrivez-nous directement à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}

function t(s: string) {
  return s;
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
