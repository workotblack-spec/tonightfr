import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, LogOut, Settings, Sparkles, ChevronRight, User } from "lucide-react";
import { T, type Lang } from "@/data/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/tonight/BottomNav";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Tonight Fribourg" },
      { name: "description", content: "Ton compte Tonight Fribourg : favoris, langue et espace pro." },
      { property: "og:title", content: "Profil — Tonight Fribourg" },
      { property: "og:description", content: "Gère tes favoris, ta langue et ton espace pro." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function Row({ to, icon, label, extra }: { to: string; icon: React.ReactNode; label: string; extra?: React.ReactNode }) {
  return (
    <Link to={to} className="press flex items-center gap-3 px-4 py-3.5 text-sm hover:bg-surface-elevated">
      <span className="text-muted-foreground">{icon}</span>
      <span className="flex-1">{label}</span>
      {extra}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

function ProfilePage() {
  const lang: Lang = "fr";
  const t = T[lang];
  const { user, role, loading } = useAuth();
  const { count } = useFavorites();

  return (
    <div className="min-h-screen pb-28">
      <main className="mx-auto max-w-xl px-5 pt-8">
        <h1 className="font-display text-[32px] font-semibold leading-tight tracking-tight">{t.profileTitle}</h1>

        <section className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-elevated">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              {loading ? (
                <p className="text-sm text-muted-foreground">{t.loading}</p>
              ) : user ? (
                <>
                  <p className="label-xs text-muted-foreground">{t.account}</p>
                  <p className="mt-1.5 truncate text-[15px] font-medium">{user.email}</p>
                </>
              ) : (
                <>
                  <p className="text-[15px] font-medium">{t.notSignedIn}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">{t.notSignedInBody}</p>
                </>
              )}
            </div>
          </div>
          {!loading && !user && (
            <Link to="/auth" className="press mt-5 flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              {t.signIn}
            </Link>
          )}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/60 divide-y divide-border">
          <Row
            to="/favorites"
            icon={<Heart className="h-4 w-4" />}
            label={t.favorites}
            extra={count > 0 ? <span className="text-xs tabular-nums text-primary">{count}</span> : null}
          />
          {(role === "venue" || role === "admin") && (
            <Row to="/admin" icon={<Settings className="h-4 w-4" />} label={t.proSpace} />
          )}
          <Row to="/promouvoir" icon={<Sparkles className="h-4 w-4" />} label={t.promote} />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface/60 divide-y divide-border">
          <Row to="/about" icon={<span className="text-xs">i</span>} label="À propos" />
          <Row to="/contact" icon={<span className="text-xs">@</span>} label="Contact" />
          <Row to="/legal" icon={<span className="text-xs">§</span>} label="Mentions légales" />
        </section>

        {user && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="press mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> {t.signOut}
          </button>
        )}
      </main>
      <BottomNav lang={lang} favCount={count} />
    </div>
  );
}
