import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const KEY = "tonight-fr:favs";

function readLocal(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeLocal(set: Set<string>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [favs, setFavs] = useState<Set<string>>(() => new Set());

  // Load: cloud if logged in, else local. On login, merge local → cloud.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user) {
        setFavs(readLocal());
        return;
      }
      const local = readLocal();
      if (local.size > 0) {
        const rows = [...local].map((event_id) => ({ user_id: user.id, event_id }));
        await supabase.from("favorites").upsert(rows, { onConflict: "user_id,event_id" });
        writeLocal(new Set());
      }
      const { data } = await supabase.from("favorites").select("event_id").eq("user_id", user.id);
      if (cancelled) return;
      setFavs(new Set((data ?? []).map((r) => r.event_id)));
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggle = useCallback(
    async (id: string) => {
      const next = new Set(favs);
      const isAdding = !next.has(id);
      isAdding ? next.add(id) : next.delete(id);
      setFavs(next);

      if (user) {
        if (isAdding) {
          await supabase.from("favorites").insert({ user_id: user.id, event_id: id });
        } else {
          await supabase.from("favorites").delete().eq("user_id", user.id).eq("event_id", id);
        }
        qc.invalidateQueries({ queryKey: ["favorites"] });
      } else {
        writeLocal(next);
      }
    },
    [favs, user, qc],
  );

  const has = useCallback((id: string) => favs.has(id), [favs]);

  return { favs, has, toggle, count: favs.size };
}
