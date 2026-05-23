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
    <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 pb-1">
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "border-transparent bg-foreground text-background shadow-elevated"
                  : "border-border bg-surface/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
