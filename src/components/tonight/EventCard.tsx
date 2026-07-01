import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Clock } from "lucide-react";
import { CATEGORIES } from "@/data/events";
import { imageFor } from "@/data/eventImages";
import { proxied } from "@/lib/image";
import { resolveEventImage } from "@/data/venuePhotos";
import type { DbEvent } from "@/lib/events";
import type { Lang } from "@/data/i18n";

function formatTime(iso: string, lang: Lang) {
  const d = new Date(iso);
  return d.toLocaleTimeString(
    lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB",
    { hour: "2-digit", minute: "2-digit" },
  );
}

export function EventCard({
  event,
  lang,
  isFav,
  onToggleFav,
  index,
}: {
  event: DbEvent;
  lang: Lang;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  index: number;
}) {
  const cat = CATEGORIES.find((c) => c.key === event.category);
  const promoted =
    !!event.is_promoted &&
    (!event.promoted_until || new Date(event.promoted_until).getTime() > Date.now());

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-card shadow-card animate-fade-up ${
        promoted ? "ring-1 ring-amber-400/60 shadow-[0_0_24px_-4px_rgba(251,191,36,0.35)]" : ""
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link
        to="/event/$id"
        params={{ id: event.id }}
        className="block"
        aria-label={event.title}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          <img
            src={(() => {
              const r = resolveEventImage(event.id, event.venue, event.image_url);
              return r ? proxied(r, 800) : imageFor(event.image_key);
            })()}
            alt={event.title}
            loading="lazy"
            width={1024}
            height={640}
            onError={(e) => {
              const img = e.currentTarget;
              const fb = imageFor(event.image_key);
              if (img.src !== fb) img.src = fb;
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

          {cat && (
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full glass px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-aurora" />
              {cat.label[lang]}
            </div>
          )}

          {promoted && (
            <div className="absolute left-3 top-12 inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-950 shadow-md">
              ★ Sponsorisé
            </div>
          )}

          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-sm font-semibold tabular-nums backdrop-blur">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {formatTime(event.starts_at, lang)}
          </div>
        </div>
      </Link>

      <button
        aria-label="Favorite"
        onClick={(e) => {
          e.preventDefault();
          onToggleFav(event.id);
        }}
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full glass transition-transform active:scale-90"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${
            isFav ? "fill-primary text-primary" : "text-foreground"
          }`}
        />
      </button>

      <Link to="/event/$id" params={{ id: event.id }} className="block">
        <div className="space-y-2 p-4">
          <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {event.venue} · {event.area}
              </span>
            </div>
            {event.price_text && (
              <span className="shrink-0 font-medium text-foreground/80">
                {event.price_text}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
