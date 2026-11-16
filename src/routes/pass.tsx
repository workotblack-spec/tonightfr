import { pageHead } from "@/lib/page-head";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Send, Users, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { BottomNav } from "@/components/tonight/BottomNav";
import { passError } from "@/lib/member-pass";
import { QRCodeSVG } from "qrcode.react";

export const Route = createFileRoute("/pass")({
  head: () => pageHead("/pass", "Mon Pass Membre — Tonight FR", "Votre Pass Membre Tonight FR : code d’entrée renouvelé toutes les 30 secondes et transfert à un ami.", true),
  component: PassPage,
});

type Pass = { id: string; status: string; events: { title: string; starts_at: string; venue: string } | null };

function LiveCode({ passId }: { passId: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const step = Math.floor(now / 30000);
  const q = useQuery({
    queryKey: ["pass-code", passId, step],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("member_pass_code", { _pass_id: passId });
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });
  const left = 30 - Math.floor((now / 1000) % 30);
  return (
    <div className="mt-5 rounded-2xl bg-foreground p-5 text-center text-background">
      {q.data?.code && <div className="mx-auto mb-3 w-fit rounded-xl bg-white p-3"><QRCodeSVG value={q.data.code} size={176} aria-label="Code QR du Pass" /></div>}
      <p className="font-mono text-lg font-semibold tracking-wider break-all" aria-live="polite">{q.data?.code ?? "…"}</p>
      <p className="mt-2 text-[12px] opacity-70">Nouveau code dans {left} s — une capture d’écran ne fonctionne pas.</p>
    </div>
  );
}

function TransferForm({ passId }: { passId: string }) {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const send = async () => {
    const { error } = await supabase.rpc("transfer_member_pass", { _pass_id: passId, _email: email });
    if (error) return setMsg(passError(error.message));
    setMsg("Pass transféré. Votre ami le voit maintenant dans son espace.");
    qc.invalidateQueries({ queryKey: ["my-passes"] });
  };
  return (
    <div className="mt-4">
      <label className="flex items-center gap-2 text-sm font-semibold"><Send className="h-4 w-4 text-primary" />Transférer à un ami membre</label>
      <div className="mt-2 flex gap-2">
        <input type="email" aria-label="E-mail de l’ami" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ami@exemple.ch" className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm" />
        <button onClick={send} disabled={!email.includes("@")} className="press h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">Envoyer</button>
      </div>
      {msg && <p role="status" className="mt-2 text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}

function PassPage() {
  const { user, loading } = useAuth();
  const { count } = useFavorites();
  const passes = useQuery({
    queryKey: ["my-passes", user?.id], enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("member_passes").select("id,status,events(title,starts_at,venue)").eq("holder_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Pass[];
    },
  });

  return (
    <div className="min-h-screen pb-28">
      <main className="mx-auto max-w-xl px-5 pt-8">
        <h1 className="font-display text-[32px] font-semibold leading-tight tracking-tight">Mon Pass Membre</h1>
        <p className="mt-2 text-sm text-muted-foreground">Un Pass par soirée. Présentez le code à l’entrée : le club le vérifie une seule fois.</p>

        {loading ? (
          <p className="mt-8 text-sm text-muted-foreground">Chargement…</p>
        ) : !user ? (
          <section className="mt-8 rounded-2xl border border-border bg-surface/60 p-5">
            <p className="text-[15px] font-medium">Connectez-vous pour voir votre Pass.</p>
            <Link to="/auth" className="press mt-4 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">Se connecter</Link>
          </section>
        ) : passes.data?.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-border bg-surface/60 p-5 text-sm">
            Aucun Pass pour l’instant. Ouvrez une soirée et touchez « Obtenir mon Pass ».
            <Link to="/explore" className="press mt-4 flex h-11 items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground">Explorer les soirées</Link>
          </section>
        ) : (
          passes.data?.map((p) => (
            <section key={p.id} className="mt-6 rounded-3xl border border-border bg-surface-elevated p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-display text-lg font-semibold"><Sparkles className="h-4 w-4 text-primary" />{p.events?.title ?? "Soirée"}</span>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold text-primary">{p.status === "active" ? "Actif" : p.status === "used" ? "Utilisé" : "Annulé"}</span>
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">{p.events?.venue}{p.events ? " · " + new Date(p.events.starts_at).toLocaleString("fr-CH", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Zurich" }) : ""}</p>
              {p.status === "active" && <><LiveCode passId={p.id} /><TransferForm passId={p.id} /></>}
            </section>
          ))
        )}

        {user && (
          <>
            <p className="mt-6 flex gap-2 rounded-2xl border border-border p-4 text-[13px] text-muted-foreground"><Users className="h-4 w-4 shrink-0 text-primary" />Libérer sa place pour la communauté (liste d’attente et Karma) arrivera bientôt.</p>
            <p className="mt-3 flex gap-3 rounded-2xl border border-border p-4 text-[13px] text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" />L’établissement reste seul à décider de l’entrée, de ses conditions et de ses tarifs. Pièce d’identité exigible.</p>
          </>
        )}
      </main>
      <BottomNav lang="fr" favCount={count} />
    </div>
  );
}
