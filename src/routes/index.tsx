import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Map, Sparkles, Heart } from "lucide-react";
import heroImg from "@/assets/hero-night.jpg";
import { EVENTS, type CategoryKey } from "@/data/events";
import { T, type Lang } from "@/data/i18n";
import { LanguageSwitcher } from "@/components/tonight/LanguageSwitcher";
import { CategoryChips } from "@/components/tonight/CategoryChips";
import { EventCard } from "@/components/tonight/EventCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tonight FR — What's on tonight in Fribourg" },
      {
        name: "description",
        content:
          "Discover tonight's afterworks, concerts, clubbing, expos and live sports in Fribourg, Switzerland. Curated nightlife in FR / DE / EN.",
      },
      { property: "og:title", content: "Tonight FR — Fribourg nightlife tonight" },
      {
        property: "og:description",
        content:
          "Everything happening in Fribourg tonight, at a glance. Afterwork, happy hour, concerts, clubbing, culture and sport.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [lang, setLang] = useState<Lang>("fr");
  const [active, setActive] = useState<CategoryKey | "all">("all");
  const [favs, setFavs] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () =>
      EVENTS.filter((e) => active === "all" || e.category === active).sort((a, b) =>
        a.time.localeCompare(b.time),
      ),
    [active],
  );

  const today = new Date().toLocaleDateString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" },
  );

  const toggleFav = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="relative min-h-screen pb-32">
      {/* Top nav */}
      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-aurora shadow-neon">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Tonight<span className="text-gradient-neon">.fr</span>
            </span>
          </div>
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="Fribourg by night"
            width={1280}
            height={1600}
            className="h-full w-full object-cover"
          />
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
              <h1 className="mt-4 font-display text-5xl font-bold leading-[0.95] tracking-tight animate-fade-up sm:text-6xl">
                {T[lang].tonightIn}
                <br />
                <span className="text-gradient-neon">{T[lang].city}.</span>
              </h1>
              <p
                className="mt-3 max-w-md text-base text-muted-foreground animate-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                {T[lang].subtitle}
              </p>

              <div
                className="mt-6 flex flex-wrap gap-3 animate-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                <a
                  href="#events"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
                >
                  {filtered.length} {T[lang].events}
                </a>
                <button className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold transition-colors hover:bg-surface-elevated">
                  <Map className="h-4 w-4" />
                  {T[lang].seeMap}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-[60px] z-30 glass-strong">
        <div className="mx-auto max-w-3xl px-5 py-3">
          <CategoryChips active={active} onChange={setActive} lang={lang} />
        </div>
      </section>

      {/* Events list */}
      <main id="events" className="mx-auto max-w-3xl px-5 pt-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">{T[lang].tonight}</h2>
          <span className="text-sm tabular-nums text-muted-foreground">
            {filtered.length} {T[lang].events}
          </span>
        </div>

        <div className="grid gap-5">
          {filtered.map((e, i) => (
            <EventCard
              key={e.id}
              event={e}
              lang={lang}
              index={i}
              isFav={favs.has(e.id)}
              onToggleFav={toggleFav}
            />
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground">{T[lang].footer}</p>
      </main>

      {/* Floating actions */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-5">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full glass-strong p-1.5 shadow-elevated">
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-neon">
            <Map className="h-4 w-4" /> {T[lang].map}
          </button>
          <button className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface">
            <Heart className="h-4 w-4" />
            {favs.size > 0 && (
              <span className="tabular-nums text-primary">{favs.size}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
