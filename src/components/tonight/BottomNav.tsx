import { Link } from "@tanstack/react-router";
import { Sparkles, Compass, Map as MapIcon, Heart, User } from "lucide-react";
import type { Lang } from "@/data/i18n";
import { T } from "@/data/i18n";

export function BottomNav({ lang, favCount = 0 }: { lang: Lang; favCount?: number }) {
  const items = [
    { to: "/", label: T[lang].navTonight, Icon: Sparkles, exact: true },
    { to: "/explore", label: T[lang].navExplore, Icon: Compass, exact: false },
    { to: "/map", label: T[lang].navMap, Icon: MapIcon, exact: false },
    { to: "/favorites", label: T[lang].navFavorites, Icon: Heart, exact: false, badge: favCount },
    { to: "/profile", label: T[lang].navProfile, Icon: User, exact: false },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 glass-strong safe-bottom">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {items.map(({ to, label, Icon, exact, ...rest }) => {
          const badge = "badge" in rest ? (rest as { badge?: number }).badge : 0;
          return (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="press group relative flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <span className="relative">
                <Icon className="h-[19px] w-[19px]" strokeWidth={1.75} />
                {!!badge && badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold tabular-nums text-primary-foreground">
                    {badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium tracking-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
