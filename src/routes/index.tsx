import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Map, Heart, CalendarX, Locate, LocateFixed, User as UserIcon, LogOut, Settings } from "lucide-react";
import heroImg from "@/assets/hero-night.jpg";
import logo from "@/assets/logo-tonight.png";
import ogImg from "@/assets/og-tonight.jpg";
import { type CategoryKey } from "@/data/events";
import { T, type Lang } from "@/data/i18n";
import { LanguageSwitcher } from "@/components/tonight/LanguageSwitcher";
import { CategoryChips } from "@/components/tonight/CategoryChips";
import { DateChips } from "@/components/tonight/DateChips";
import { SearchBar } from "@/components/tonight/SearchBar";
import { EventCard } from "@/components/tonight/EventCard";
import { EventCardSkeleton } from "@/components/tonight/EventCardSkeleton";
import { fetchEvents, type WhenFilter, type DbEvent, type CityFilter } from "@/lib/events";
import { useFavorites } from "@/hooks/useFavorites";
import { useGeolocation, distanceKm } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tonight Fribourg — Bars, clubs & sorties ce soir" },
      {
        name: "description",
        content:
          "Trouve les bars, clubs, chichas, concerts et afterworks autour de toi à Fribourg, Bulle et Lausanne. La vie nocturne romande en un coup d'œil.",
      },
      { property: "og:title", content: "Tonight Fribourg — sorties ce soir" },
      {
        property: "og:description",
        content:
          "Bars, clubs, chichas, concerts et afterworks autour de toi à Fribourg, Bulle et Lausanne.",
      },
      { property: "og:image", content: ogImg },
      { name: "twitter:image", content: ogImg },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [lang, setLang] = useState<Lang>("fr");
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [when, setWhen] = useState<WhenFilter>("all");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<CityFilter>("all");
  const { has, toggle, count } = useFavorites();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const geo = useGeolocation();

  const eventsQuery = useQuery({
    queryKey: ["events", when, active, city],
    queryFn: () => fetchEvents({ when, category: active, city }),
  });

  const events = useMemo(() => {
    let list: (DbEvent & { _distance?: number })[] = eventsQuery.data ?? [];
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.venue.toLowerCase().includes(term) ||
          e.area.toLowerCase().includes(term),
      );
    }
    if (geo.coords) {
      list = list
        .map((e) => ({
          ...e,
          _distance:
            e.lat != null && e.lng != null
              ? distanceKm(geo.coords!, { lat: e.lat, lng: e.lng })
              : Number.POSITIVE_INFINITY,
        }))
        .sort((a, b) => {
          const ap = a.is_promoted ? 1 : 0;
          const bp = b.is_promoted ? 1 : 0;
          if (ap !== bp) return bp - ap;
          return (a._distance ?? Infinity) - (b._distance ?? Infinity);
        });
    }
    return list;
  }, [eventsQuery.data, search, geo.coords]);

  const today = new Date().toLocaleDateString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );

  return (
    <div className="relative min-h-screen pb-32">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 drop-shadow-[0_0_12px_rgba(255,45,184,0.35)]"
            />
            <span className="font-display text-base font-semibold tracking-tight">
              Tonight<span className="text-gradient-neon"> Fribourg</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} onChange={setLang} />
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full glass hover:bg-surface-elevated"
                aria-label={T[lang].myAccount}
              >
                <UserIcon className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border/40 bg-background shadow-elevated"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {auth.user ? (
                    <>
                      <div className="px-3 py-2 text-xs text-muted-foreground truncate">
                        {auth.user.email}
                      </div>
                      <Link to="/favorites" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-elevated" onClick={() => setMenuOpen(false)}>
                        <Heart className="h-4 w-4" /> {T[lang].favorites}
                      </Link>
                      {(auth.role === "venue" || auth.role === "admin") && (
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-elevated" onClick={() => setMenuOpen(false)}>
                          <Settings className="h-4 w-4" /> {T[lang].admin}
                        </Link>
                      )}
                      <button
                        onClick={() => { supabase.auth.signOut(); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-elevated"
                      >
                        <LogOut className="h-4 w-4" /> {T[lang].signOut}
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" className="block px-3 py-2 text-sm hover:bg-surface-elevated" onClick={() => setMenuOpen(false)}>
                      {T[lang].signIn}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Nuit à Fribourg, Bulle et Lausanne"
            width={1280}
            height={1600}
            className="h-full w-full object-cover scale-105 will-change-transform"
            style={{ transform: "translateZ(0)" }}
          />
          {/* Halos néon 3D subtils */}
          <div className="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/30 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-hero" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-3xl px-5 pb-10">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {T[lang].nowLive} · {today}
              </div>

              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight animate-fade-up sm:text-6xl">
                Ce soir,
                <br />
                <span className="text-gradient-neon drop-shadow-[0_0_30px_oklch(0.82_0.13_85/0.4)]">
                  on sort où&nbsp;?
                </span>
              </h1>


              <p
                className="mt-4 max-w-md text-base text-foreground/80 animate-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                {T[lang].subtitle}
              </p>

              {/* Pills villes */}
              <div
                className="mt-5 flex flex-wrap gap-2 animate-fade-up"
                style={{ animationDelay: "160ms" }}
              >
                {["Fribourg", "Bulle", "Lausanne"].map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-aurora" />
                    {c}
                  </span>
                ))}
              </div>

              <div
                className="mt-6 flex flex-wrap gap-3 animate-fade-up"
                style={{ animationDelay: "220ms" }}
              >
                <button
                  onClick={geo.coords ? geo.clear : geo.request}
                  disabled={geo.loading}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-neon transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
                >
                  {geo.coords ? <LocateFixed className="h-4 w-4" /> : <Locate className="h-4 w-4" />}
                  {T[lang].nearMeCta}
                </button>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 rounded-full glass px-5 py-3.5 text-sm font-semibold transition-colors hover:bg-surface-elevated"
                >
                  <Map className="h-4 w-4" />
                  {T[lang].seeMap}
                </Link>
                <a
                  href="#events"
                  className="inline-flex items-center gap-2 rounded-full border border-border/50 px-5 py-3.5 text-sm font-medium text-foreground/90 hover:bg-surface"
                >
                  {events.length} {T[lang].events}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Search + Date + Category filter */}
      <section className="sticky top-[60px] z-30 glass-strong">
        <div className="mx-auto max-w-3xl space-y-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} placeholder={T[lang].searchPh} />
            </div>
            <button
              onClick={geo.coords ? geo.clear : geo.request}
              disabled={geo.loading}
              aria-label={T[lang].locateMe}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${
                geo.coords
                  ? "bg-gradient-aurora text-primary-foreground shadow-neon"
                  : "glass hover:bg-surface-elevated"
              }`}
            >
              {geo.coords ? <LocateFixed className="h-4 w-4" /> : <Locate className="h-4 w-4" />}
            </button>
          </div>
          {/* City chips */}
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(["all", "Fribourg", "Bulle", "Lausanne"] as CityFilter[]).map((c) => {
              const isActive = city === c;
              const label = c === "all" ? T[lang].all : c;
              return (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-foreground text-background shadow-elevated"
                      : "glass text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <DateChips active={when} onChange={setWhen} lang={lang} />
          <CategoryChips active={active} onChange={setActive} lang={lang} />
        </div>
      </section>


      <main id="events" className="mx-auto max-w-3xl px-5 pt-8">
        {/* Coupe du Monde 2026 — masqué tant que pas de vraies fixtures */}


        {/* Pro CTA banner */}
        <Link
          to="/promouvoir"
          className="group mb-6 flex items-center justify-between gap-4 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-surface/60 via-surface/40 to-fuchsia-500/10 px-5 py-4 shadow-card transition-transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400/15 text-lg">✨</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Vous êtes un lieu ou un organisateur&nbsp;?</p>
              <p className="text-xs text-muted-foreground">Mettez votre soirée en avant — dès 0&nbsp;CHF</p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-full border border-gold-soft bg-background/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-transform group-hover:translate-x-0.5 sm:inline-block">
            Promouvoir →
          </span>
        </Link>


        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{T[lang][whenLabelKey(when)]}</h2>
          <span className="text-sm tabular-nums text-muted-foreground">
            {events.length} {T[lang].events}
          </span>
        </div>


        {eventsQuery.isLoading ? (
          <div className="grid gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl glass py-14 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-elevated">
              <CalendarX className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{T[lang].noEvents}</p>
            <button
              onClick={() => setWhen("all")}
              className="mt-1 rounded-full bg-gradient-aurora px-4 py-2 text-xs font-semibold text-primary-foreground shadow-neon"
            >
              {T[lang].fAll}
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {events.map((e, i) => (
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
        )}

        <footer className="mt-16 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <Link
            to="/promouvoir"
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/20"
          >
            ✨ Promouvoir mon événement
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-foreground">
              À propos
            </Link>
            <span>·</span>
            <Link to="/legal" className="hover:text-foreground">
              Mentions légales
            </Link>
          </div>
          <p>{T[lang].footer}</p>
        </footer>
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-5">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full glass-strong p-1.5 shadow-elevated">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-neon"
          >
            <Map className="h-4 w-4" /> {T[lang].map}
          </Link>
          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            <Heart className="h-4 w-4" />
            {count > 0 && <span className="tabular-nums text-primary">{count}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}

function whenLabelKey(w: WhenFilter): string {
  return w === "tonight"
    ? "fTonight"
    : w === "tomorrow"
      ? "fTomorrow"
      : w === "weekend"
        ? "fWeekend"
        : "fAll";
}
