import { CATEGORIES, type CategoryKey } from "@/data/events";
import type { Lang } from "@/data/i18n";
import { T } from "@/data/i18n";

export function CategoryChips({
  active,
  onChange,
  lang,
}: {
  active: CategoryKey | "all";
  onChange: (c: CategoryKey | "all") => void;
  lang: Lang;
}) {
  const items: { key: CategoryKey | "all"; label: string }[] = [
    { key: "all", label: T[lang].all },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label[lang] })),
  ];

  return (
    <div className="no-scrollbar snap-row -mx-5 flex gap-2 overflow-x-auto scroll-smooth px-5">
      {items.map((it) => {
        const isActive = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={`press whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
