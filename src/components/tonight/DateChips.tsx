import type { WhenFilter } from "@/lib/events";
import type { Lang } from "@/data/i18n";
import { T } from "@/data/i18n";

export function DateChips({
  active,
  onChange,
  lang,
}: {
  active: WhenFilter;
  onChange: (w: WhenFilter) => void;
  lang: Lang;
}) {
  const items: { key: WhenFilter; label: string }[] = [
    { key: "tonight", label: T[lang].fTonight },
    { key: "tomorrow", label: T[lang].fTomorrow },
    { key: "weekend", label: T[lang].fWeekend },
    { key: "all", label: T[lang].fAll },
  ];

  return (
    <div className="flex gap-2">
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "bg-gradient-aurora text-primary-foreground shadow-neon"
                : "glass text-foreground hover:bg-surface-elevated"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
