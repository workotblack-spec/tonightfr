import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-fade-up flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface/40 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-elevated text-muted-foreground">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      {body && <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
