import { useQuery } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function HouseRules({ venue }: { venue: string }) {
  const q = useQuery({
    queryKey: ["venue-rules", venue],
    queryFn: async () => {
      const { data } = await supabase
        .from("venues")
        .select("min_age,dress_code,cloakroom,table_min_spend,vip_rules")
        .ilike("name", venue.trim())
        .limit(1)
        .maybeSingle();
      return data;
    },
  });
  const v = q.data;
  if (!v) return null;
  const rows: [string, string | null][] = [
    ["Âge minimum", `${v.min_age}+`],
    ["Dress code", v.dress_code],
    ["Vestiaire", v.cloakroom],
    ["Minimum table", v.table_min_spend],
    ["Règles VIP", v.vip_rules],
  ];
  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface/60 p-5">
      <div className="flex items-center gap-2 text-primary">
        <ShieldCheck className="h-4 w-4" />
        <p className="label-xs">Règles maison</p>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        {rows.filter(([, val]) => val && val.trim()).map(([k, val]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right">{val}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">Fixées par l'établissement. Tout se règle sur place.</p>
    </section>
  );
}
