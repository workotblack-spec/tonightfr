import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { DbEvent } from "./events";

// Public event data only; never use the privileged client for shareable pages.
export const getPublicEvent = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }): Promise<DbEvent | null> => {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Événement indisponible temporairement.");
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
            headers.delete("Authorization");
          }
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });
    const { data: event, error } = await db.from("events")
      .select("id,title,venue,area,category,starts_at,image_key,image_url,price_text,description,lineup,address,lat,lng,ticket_url,is_promoted,promoted_until")
      .eq("id", data.id).maybeSingle();
    if (error) throw new Error("Événement indisponible temporairement.");
    return event as DbEvent | null;
  });