import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Compass, ChevronRight, SearchX } from "lucide-react";
import { CATEGORIES, type CategoryKey } from "@/data/events";
import { T, type Lang } from "@/data/i18n";
import { fetchEvents, type CityFilter, type DbEvent } from "@/lib/events";
import { EventCard } from "@/components/tonight/EventCard";
import { EventCardSkeleton } from "@/components/tonight/EventCardSkeleton";
import { EmptyState } from "@/components/tonight/EmptyState";
import { BottomNav } from "@/components/tonight/BottomNav";
import { SearchBar } from "@/components/tonight/SearchBar";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explorer — Tonight Fribourg" },
      {
        name: "description",
        content:
          "Explore la vie nocturne de Fribourg, Bulle et Lausanne par catégorie : clubbing, concerts, afterworks, culture et sport en direct.",
      },
      { property: "og:title", content: "Explorer la nuit — Tonight Fribourg" },
      {
        property: "og:description",
        content: "Clubbing, concerts, afterworks, culture et sport en direct à Fribourg, Bulle et Lausanne.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const lang: Lang = "fr";
  const t = T[lang];
  const [city, setCity] = useState<CityFilter>("all");
  const [search, setSearch] = useState("");
  const { has, toggle, count } = useFavorites();

  const q = useQuery({
    queryKey: ["events", "explore", city],
    queryFn: () => fetchEvents({ when: "all", category: "all", city }),
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = q.data ?? [];
    if (!term) return list;
    return list.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.venue.toLowerCase().includes(term) ||
        e.area.toLowerCase().includes(term),
    );
  }, [q.data, search]);

  const groups = useMemo(() => {
    const map = new Map<CategoryKey, DbEvent[]>();
    for (const e of filtered) {
      const arr = map.get(e.category) ?? [];
      arr.push(e);
      map.set(e.category, arr);
    }
    return CATEGORIES.map((c) => ({ cat: c, items: map.get(c.key) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [filtered]);

  return (
    <div className="min-h-screen pb-28">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-5 py-4">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{t.exploreTitle}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">{t.exploreSub}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-3 px-5 pt-4">
        <SearchBar value={search} onChange={setSearch} placeholder={t.searchPh} />
        <div className="no-scrollbar snap-row -mx-5 flex gap-2 overflow-x-auto px-5">
          {(["all", "Fribourg", "Bulle", "Lausanne"] as CityFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`press whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                city === c
                  ? "border-primary/40 bg-primary/12 text-primary"
                  : "border-border bg-surface/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? t.all : c}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 pt-6">
        {q.isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={search ? <SearchX className="h-5 w-5" /> : <Compass className="h-5 w-5" />}
            title={search ? t.emptyResultsTitle : t.emptyEventsTitle}
            body={search ? t.emptyResultsBody : t.emptyEventsBody}
          />
        ) : (
          <div className="space-y-10">
            {groups.map(({ cat, items }) => (
              <section key={cat.key}>
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="font-display text-[19px] font-semibold tracking-tight">
                    {cat.label[lang]}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
                    {items.length} {t.events}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="grid gap-4">
                  {items.slice(0, 4).map((e, i) => (
                    <EventCard
                      key={e.id}
                      event={e}
                      lang={lang}
                      index={i}
                      isFav={has(e.id)}
                      onToggleFav={toggle}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="press inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t.navTonight}
          </Link>
        </div>
      </main>

      <BottomNav lang={lang} favCount={count} />
    </div>
  );
}
