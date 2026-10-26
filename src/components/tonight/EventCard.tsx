import { Link } from "@tanstack/react-router";
import { Heart, MapPin, ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/events";
import { imageFor } from "@/data/eventImages";
import { proxied } from "@/lib/image";
import { resolveEventImage } from "@/data/venuePhotos";
import type { DbEvent } from "@/lib/events";
import type { Lang } from "@/data/i18n";

function formatTime(iso: string, lang: Lang) {
  const d = new Date(iso);
  return d.toLocaleTimeString(lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string, lang: Lang) {
  return new Date(iso).toLocaleDateString(lang === "fr" ? "fr-CH" : lang === "de" ? "de-CH" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function EventCard({
  event,
  lang,
  isFav,
  onToggleFav,
  index,
}: {
  event: DbEvent & { _distance?: number };
  lang: Lang;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  index: number;
}) {
  const cat = CATEGORIES.find((c) => c.key === event.category);
  const promoted =
    !!event.is_promoted &&
    (!event.promoted_until || new Date(event.promoted_until).getTime() > Date.now());
  const dist = event._distance;
  const showDist = dist != null && Number.isFinite(dist);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-card shadow-card animate-fade-up press ${
        promoted ? "border-primary/35" : "border-border"
      }`}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <Link to="/event/$id" params={{ id: event.id }} className="block" aria-label={event.title}>
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          <img
            src={(() => {
              const r = resolveEventImage(event.id, event.venue, event.image_url);
              return r ? proxied(r, 900) : imageFor(event.image_key);
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
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/85 to-transparent" />

          {promoted && (
            <div className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
              Sponsorisé
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-baseline gap-2">
            <span className="font-display text-[26px] font-semibold leading-none tabular-nums tracking-tight text-foreground">
              {formatTime(event.starts_at, lang)}
            </span>
            <span className="text-xs capitalize text-foreground/70">{formatDay(event.starts_at, lang)}</span>
          </div>
        </div>

        <div className="p-4 pt-3.5">
          {cat && <p className="label-xs text-primary">{cat.label[lang]}</p>}
          <h3 className="mt-2 line-clamp-2 text-[17px] font-semibold leading-snug tracking-tight">
            {event.title}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-3 text-[13px] text-muted-foreground">
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              <span className="truncate">
                {event.venue} · {event.area}
                {showDist && <> · {dist! < 1 ? `${Math.round(dist! * 1000)} m` : `${dist!.toFixed(1)} km`}</>}
              </span>
            </div>
            {event.price_text && (
              <span className="shrink-0 font-medium text-foreground/85">{event.price_text}</span>
            )}
          </div>
          <div className="mt-3.5 flex items-center justify-end border-t border-border pt-3 text-[13px] font-medium text-foreground/80 transition-colors group-hover:text-primary">
            Voir la soirée <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </div>
        </div>
      </Link>

      <button
        aria-label="Favorite"
        onClick={(e) => {
          e.preventDefault();
          onToggleFav(event.id);
        }}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/60 backdrop-blur-md transition-transform active:scale-90"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${isFav ? "fill-primary text-primary" : "text-foreground"}`}
          strokeWidth={1.75}
        />
      </button>
    </article>
  );
}
