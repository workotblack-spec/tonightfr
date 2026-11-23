import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sparkles, Compass, Map as MapIcon, Heart, User } from "lucide-react";
import type { Lang } from "@/data/i18n";
import { T } from "@/data/i18n";

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const;

export function BottomNav({ lang, favCount = 0 }: { lang: Lang; favCount?: number }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [
    { to: "/", label: T[lang].navTonight, Icon: Sparkles, exact: true, badge: 0 },
    { to: "/explore", label: T[lang].navExplore, Icon: Compass, exact: false, badge: 0 },
    { to: "/map", label: T[lang].navMap, Icon: MapIcon, exact: false, badge: 0 },
    { to: "/favorites", label: T[lang].navFavorites, Icon: Heart, exact: false, badge: favCount },
    { to: "/profile", label: T[lang].navProfile, Icon: User, exact: false, badge: 0 },
  ] as const;

  return (
    <nav
      aria-label="Navigation principale"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="smoked pointer-events-auto mx-auto flex max-w-md items-stretch justify-between rounded-[1.75rem] border border-border/60 px-1.5 py-1.5 shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_45%,transparent)]">
        {items.map(({ to, label, Icon, exact, badge }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <motion.div key={to} className="relative flex-1" whileTap={{ scale: 0.9 }} transition={SPRING}>
              <Link
                to={to}
                activeOptions={{ exact }}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-muted-foreground transition-colors data-[status=active]:text-primary-foreground"
              >
                {active && (
                  <motion.span
                    layoutId="nav-neon-bubble"
                    transition={SPRING}
                    className="absolute inset-0 -z-0 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_22px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
                  />
                )}
                <span className="relative z-10">
                  <Icon className="h-[19px] w-[19px]" strokeWidth={1.75} />
                  {badge > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-background px-1 text-[9px] font-bold tabular-nums text-primary">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="relative z-10 text-[10px] font-medium tracking-tight">{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
