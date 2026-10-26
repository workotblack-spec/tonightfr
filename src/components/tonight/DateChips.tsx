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
    <div className="inline-flex rounded-xl border border-border bg-surface/60 p-1">
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`press whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              isActive ? "bg-surface-elevated text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
