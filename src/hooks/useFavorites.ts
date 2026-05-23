import { useCallback, useEffect, useState } from "react";

const KEY = "tonight-fr:favs";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setFavs(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setFavs(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: Set<string>) => {
    setFavs(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  };

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(favs);
      next.has(id) ? next.delete(id) : next.add(id);
      persist(next);
    },
    [favs],
  );

  const has = useCallback((id: string) => favs.has(id), [favs]);

  return { favs, has, toggle, count: favs.size };
}
