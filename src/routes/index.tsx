import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Map, CalendarX, Locate, LocateFixed, MapPin, User as UserIcon, SearchX, ArrowRight } from "lucide-react";
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
import { BottomNav } from "@/components/tonight/BottomNav";
import { EmptyState } from "@/components/tonight/EmptyState";

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
  const geo = useGeolocation();
  const t = T[lang];

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
      list = list.map((e) => ({
        ...e,
        _distance:
          e.lat != null && e.lng != null
            ? distanceKm(geo.coords!, { lat: e.lat, lng: e.lng })
            : Number.POSITIVE_INFINITY,
      }));
    }
    return list;
  }, [eventsQuery.data, search, geo.coords]);

  const today = new Date().toLocaleDateString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );

  return (
    <div className="relative min-h-screen pb-28">
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="" width={28} height={28} className="h-7 w-7" />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              Tonight<span className="text-primary">.</span>fr
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-xs text-muted-foreground sm:inline-flex">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} /> Fribourg
            </span>
            <LanguageSwitcher lang={lang} onChange={setLang} />
            <Link
              to="/profile"
              aria-label={t.myAccount}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
            >
              <UserIcon className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero compact */}
      <section className="mx-auto max-w-3xl px-5 pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img
            src={heroImg}
            alt="Fribourg la nuit"
            width={1280}
            height={1600}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative px-5 pb-6 pt-24 sm:px-8 sm:pt-32">
            <div className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="capitalize">{today}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Fribourg</span>
            </div>
            <h1 className="mt-3 font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] animate-fade-up sm:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-foreground/75 animate-fade-up" style={{ animationDelay: "80ms" }}>
              {t.heroSub}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2 animate-fade-up" style={{ animationDelay: "140ms" }}>
              <button
                onClick={geo.coords ? geo.clear : geo.request}
                disabled={geo.loading}
                className="press inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {geo.coords ? <LocateFixed className="h-4 w-4" /> : <Locate className="h-4 w-4" />}
                {t.nearMeCta}
              </button>
              <Link
                to="/map"
                className="press inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-background/40 px-4 text-sm font-medium backdrop-blur hover:bg-surface"
              >
                <Map className="h-4 w-4" strokeWidth={1.75} /> {t.seeMap}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="sticky top-[57px] z-30 mt-4 glass-strong">
        <div className="mx-auto max-w-3xl space-y-3 px-5 py-3">
          <SearchBar value={search} onChange={setSearch} placeholder={t.searchPh} />
          <div className="no-scrollbar -mx-5 flex items-center gap-3 overflow-x-auto px-5">
            <DateChips active={when} onChange={setWhen} lang={lang} />
            <div className="h-5 w-px shrink-0 bg-border" />
            {(["all", "Fribourg", "Bulle", "Lausanne"] as CityFilter[]).map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`press whitespace-nowrap text-[13px] font-medium transition-colors ${
                  city === c ? "text-foreground underline decoration-primary decoration-2 underline-offset-[6px]" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "all" ? t.all : c}
              </button>
            ))}
          </div>
          <CategoryChips active={active} onChange={setActive} lang={lang} />
        </div>
      </section>

      <main id="events" className="mx-auto max-w-3xl px-5 pt-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight">{t[whenLabelKey(when)]}</h2>
          <span className="text-[13px] tabular-nums text-muted-foreground">
            {events.length} {t.events}
            {geo.coords && <> · {t.nearMe}</>}
          </span>
        </div>

        {eventsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          search ? (
            <EmptyState
              icon={<SearchX className="h-5 w-5" />}
              title={t.emptyResultsTitle}
              body={t.emptyResultsBody}
              action={
                <button onClick={() => setSearch("")} className="press rounded-xl border border-border px-4 py-2 text-sm">
                  {t.cancel}
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<CalendarX className="h-5 w-5" />}
              title={t.emptyEventsTitle}
              body={t.emptyEventsBody}
              action={
                <button onClick={() => setWhen("weekend")} className="press rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  {t.fWeekend}
                </button>
              }
            />
          )
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((e, i) => (
              <EventCard key={e.id} event={e} lang={lang} index={i} isFav={has(e.id)} onToggleFav={toggle} />
            ))}
          </div>
        )}

        {/* Pro */}
        <Link
          to="/promouvoir"
          className="press group mt-10 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface/60 px-5 py-4"
        >
          <div>
            <p className="label-xs text-primary">Pro</p>
            <p className="mt-2 text-[15px] font-semibold">Vous êtes un lieu ou un organisateur&nbsp;?</p>
            <p className="mt-0.5 text-[13px] text-muted-foreground">Mettez votre soirée en avant — dès 0&nbsp;CHF</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </Link>

        <footer className="mt-12 flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-foreground">À propos</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <span>·</span>
            <Link to="/legal" className="hover:text-foreground">Mentions légales</Link>
          </div>
          <p>{t.footer}</p>
        </footer>
      </main>

      <BottomNav lang={lang} favCount={count} />
    </div>
  );
}

function whenLabelKey(w: WhenFilter): string {
  return w === "tonight" ? "fTonight" : w === "tomorrow" ? "fTomorrow" : w === "weekend" ? "fWeekend" : "fAll";
}
