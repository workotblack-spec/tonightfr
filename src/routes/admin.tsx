import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CATEGORIES, type CategoryKey } from "@/data/events";
import { T } from "@/data/i18n";
import type { DbEvent } from "@/lib/events";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Tonight.fr — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type FormState = Partial<DbEvent> & { starts_at_local?: string };

function emptyForm(): FormState {
  return {
    title: "",
    venue: "",
    area: "",
    category: "concert" as CategoryKey,
    starts_at_local: "",
    price_text: "",
    description: "",
    address: "",
    ticket_url: "",
    image_key: "concert",
    lat: null,
    lng: null,
  };
}

function AdminPage() {
  const t = T.fr;
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<FormState | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const q = useQuery({
    queryKey: ["my-events", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("owner_id", user!.id)
        .order("starts_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DbEvent[];
    },
  });

  const canEdit = role === "venue" || role === "admin";

  const onSave = async (f: FormState) => {
    if (!user) return;
    const payload = {
      title: f.title!,
      venue: f.venue!,
      area: f.area!,
      category: f.category!,
      starts_at: new Date(f.starts_at_local!).toISOString(),
      image_key: f.image_key || f.category!,
      price_text: f.price_text || null,
      description: f.description || null,
      address: f.address || null,
      ticket_url: f.ticket_url || null,
      lat: f.lat ?? null,
      lng: f.lng ?? null,
      owner_id: user.id,
    };
    let err;
    if (f.id) {
      ({ error: err } = await supabase.from("events").update(payload).eq("id", f.id));
    } else {
      ({ error: err } = await supabase.from("events").insert(payload));
    }
    if (err) {
      alert(err.message);
      return;
    }
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["my-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  };

  const onDelete = async (id: string) => {
    if (!confirm(t.confirmDelete)) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["my-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  };

  const onTogglePromo = async (e: DbEvent) => {
    const active = e.is_promoted && (!e.promoted_until || new Date(e.promoted_until).getTime() > Date.now());
    const payload = active
      ? { is_promoted: false, promoted_until: null }
      : { is_promoted: true, promoted_until: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString() };
    const { error } = await supabase.from("events").update(payload).eq("id", e.id);
    if (error) { alert(error.message); return; }
    qc.invalidateQueries({ queryKey: ["my-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  };

  return (
    <div className="min-h-screen bg-background px-5 py-6 pb-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {t.back}
        </Link>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">{t.admin}</h1>
            <p className="text-sm text-muted-foreground">{role ? `${t.welcome} · ${role}` : t.loading}</p>
          </div>
          {canEdit && (
            <button
              onClick={() => setEditing(emptyForm())}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-4 py-2 text-sm font-semibold text-primary-foreground shadow-neon"
            >
              <Plus className="h-4 w-4" /> {t.addEvent}
            </button>
          )}
        </div>

        {!canEdit && !loading && (
          <div className="mt-8 rounded-2xl glass p-6 text-sm text-muted-foreground">
            {t.becomeVenue}
          </div>
        )}

        {canEdit && (
          <div className="mt-6 space-y-3">
            {(q.data ?? []).length === 0 && !q.isLoading && (
              <p className="rounded-2xl glass p-6 text-sm text-muted-foreground">
                {t.myEvents} — {t.noEvents}
              </p>
            )}
            {(q.data ?? []).map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 rounded-xl glass p-4"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{e.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {e.venue} · {new Date(e.starts_at).toLocaleString("fr-CH")}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  {role === "admin" && (() => {
                    const active = e.is_promoted && (!e.promoted_until || new Date(e.promoted_until).getTime() > Date.now());
                    return (
                      <button
                        onClick={() => onTogglePromo(e)}
                        title={active ? "Retirer la promotion" : "Promouvoir 30 jours"}
                        className={`grid h-9 w-9 place-items-center rounded-full hover:bg-surface-elevated ${active ? "text-amber-300" : "text-muted-foreground"}`}
                        aria-label="Promouvoir"
                      >
                        <Sparkles className="h-4 w-4" />
                      </button>
                    );
                  })()}
                  <button
                    onClick={() =>
                      setEditing({
                        ...e,
                        starts_at_local: new Date(e.starts_at).toISOString().slice(0, 16),
                      })
                    }
                    className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface-elevated"
                    aria-label={t.editEvent}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(e.id)}
                    className="grid h-9 w-9 place-items-center rounded-full text-destructive hover:bg-surface-elevated"
                    aria-label={t.deleteEvent}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <EventEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}

function EventEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: FormState;
  onClose: () => void;
  onSave: (f: FormState) => Promise<void>;
}) {
  const t = T.fr;
  const [f, setF] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(f);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-end overflow-y-auto bg-black/60 sm:place-items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-lg space-y-3 rounded-t-3xl bg-background p-6 shadow-elevated sm:rounded-3xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {f.id ? t.editEvent : t.addEvent}
          </h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-elevated">
            <X className="h-4 w-4" />
          </button>
        </div>

        <Field label={t.title}>
          <input required value={f.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.venue}>
            <input required value={f.venue ?? ""} onChange={(e) => set("venue", e.target.value)} className={inputCls} />
          </Field>
          <Field label={t.area}>
            <input required value={f.area ?? ""} onChange={(e) => set("area", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.category}>
            <select
              value={f.category}
              onChange={(e) => set("category", e.target.value as CategoryKey)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label.fr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.startsAt}>
            <input
              required
              type="datetime-local"
              value={f.starts_at_local ?? ""}
              onChange={(e) => set("starts_at_local", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label={t.price}>
          <input value={f.price_text ?? ""} onChange={(e) => set("price_text", e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.address}>
          <input value={f.address ?? ""} onChange={(e) => set("address", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t.lat}>
            <input
              type="number"
              step="0.000001"
              value={f.lat ?? ""}
              onChange={(e) => set("lat", e.target.value === "" ? null : Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label={t.lng}>
            <input
              type="number"
              step="0.000001"
              value={f.lng ?? ""}
              onChange={(e) => set("lng", e.target.value === "" ? null : Number(e.target.value))}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label={t.ticketUrl}>
          <input type="url" value={f.ticket_url ?? ""} onChange={(e) => set("ticket_url", e.target.value)} className={inputCls} />
        </Field>
        <Field label={t.description}>
          <textarea
            rows={3}
            value={f.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full glass py-2.5 text-sm font-medium">
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-full bg-gradient-aurora py-2.5 text-sm font-semibold text-primary-foreground shadow-neon disabled:opacity-50"
          >
            {t.save}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-lg glass px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
