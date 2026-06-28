import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Send, CheckCircle2, Loader2, MessageSquare, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Tonight Fribourg" },
      { name: "description", content: "Contacter l'équipe Tonight — signaler un événement, soumettre un lieu, ou nous écrire." },
      { property: "og:title", content: "Contact — Tonight Fribourg" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContactPage,
});

type Reason = "event" | "venue" | "bug" | "press" | "other";

const REASONS: { id: Reason; label: string; icon: typeof Mail }[] = [
  { id: "event", label: "Soumettre un événement", icon: Send },
  { id: "venue", label: "Référencer mon établissement", icon: Building2 },
  { id: "bug", label: "Signaler un problème", icon: MessageSquare },
  { id: "press", label: "Presse / partenariat", icon: Mail },
  { id: "other", label: "Autre", icon: MessageSquare },
];

function ContactPage() {
  const [reason, setReason] = useState<Reason>("event");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Merci de remplir nom, email et message.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("promo_requests").insert({
      venue: form.subject || `[${reason}] ${form.name}`,
      contact_name: form.name,
      email: form.email,
      message: `[${reason}] ${form.message}`,
      plan: "starter",
      city: "Autre",
    });
    setSending(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Écris-nous à tonightfribourg@proton.me");
      return;
    }
    setSent(true);
    toast.success("Message envoyé ! On répond sous 24-48h.");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-full glass">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold">Contact</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <CheckCircle2 className="h-3 w-3" /> On répond sous 24h
          </span>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight">Écris-nous</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Une question, un événement à signaler, un lieu à référencer ? On est là.
          </p>
        </div>

        {sent ? (
          <div className="rounded-3xl border border-border/40 glass p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Message bien reçu !</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              On te répond à {form.email} sous 24-48h.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Retour à l'accueil
              </Link>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
                className="rounded-full glass px-5 py-2.5 text-sm font-semibold"
              >
                Nouveau message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Motif
              </label>
              <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReason(r.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        reason === r.id
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : "border-border/40 glass text-muted-foreground hover:border-border"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  maxLength={100}
                  className="h-11 w-full rounded-2xl glass px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                  maxLength={255}
                  placeholder="toi@exemple.com"
                  className="h-11 w-full rounded-2xl glass px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sujet
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={onChange("subject")}
                maxLength={150}
                className="h-11 w-full rounded-2xl glass px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={onChange("message")}
                maxLength={2000}
                className="w-full rounded-2xl glass px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-lg disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {sending ? "Envoi…" : "Envoyer le message"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              Ou écris-nous directement à{" "}
              <a href="mailto:tonightfribourg@proton.me" className="text-primary underline">
                tonightfribourg@proton.me
              </a>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
