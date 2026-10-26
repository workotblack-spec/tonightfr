import type { Lang } from "@/data/i18n";

const LANGS: Lang[] = ["fr", "de", "en"];

export function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border p-0.5 text-[11px] font-medium tracking-wider">
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            onClick={() => onChange(l)}
            className={`rounded-md px-2 py-1 uppercase transition-colors ${
              active ? "bg-surface-elevated text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
