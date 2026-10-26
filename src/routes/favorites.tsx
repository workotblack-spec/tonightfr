import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { EventCard } from "@/components/tonight/EventCard";
import { EmptyState } from "@/components/tonight/EmptyState";
import { BottomNav } from "@/components/tonight/BottomNav";
import type { DbEvent } from "@/lib/events";
import { T } from "@/data/i18n";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Tonight.fr — Favoris" }, { name: "robots", content: "noindex" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const t = T.fr;
  const { user, loading: authLoading } = useAuth();
  const { favs, has, toggle } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const ids = [...favs];
  const q = useQuery({
    queryKey: ["events", "favs", ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").in("id", ids);
      if (error) throw error;
      return (data ?? []) as DbEvent[];
    },
  });

  return (
    <div className="min-h-screen bg-background px-5 py-6 pb-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>
        <h1 className="mt-4 font-display text-[32px] font-semibold tracking-tight">{t.favorites}</h1>

        {ids.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<Heart className="h-5 w-5" />}
              title={t.emptyFavTitle}
              body={t.emptyFavBody}
              action={<Link to="/" className="press rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{t.navTonight}</Link>}
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(q.data ?? []).map((e, i) => (
              <EventCard key={e.id} event={e} lang="fr" index={i} isFav={has(e.id)} onToggleFav={toggle} />
            ))}
          </div>
        )}
      </div>
      <BottomNav lang="fr" favCount={ids.length} />
    </div>
  );
}
