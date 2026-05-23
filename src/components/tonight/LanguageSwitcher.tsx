import type { Lang } from "@/data/i18n";

const LANGS: Lang[] = ["fr", "de", "en"];

export function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (l: Lang) => void;
}) {
  return (
    <div className="glass inline-flex rounded-full p-1 text-xs font-medium tracking-wide">
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            onClick={() => onChange(l)}
            className={`relative rounded-full px-3 py-1.5 uppercase transition-colors ${
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {active && (
              <span className="absolute inset-0 -z-0 rounded-full bg-gradient-aurora shadow-neon" />
            )}
            <span className="relative z-10">{l}</span>
          </button>
        );
      })}
    </div>
  );
}
