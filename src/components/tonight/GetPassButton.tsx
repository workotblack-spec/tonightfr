import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { isUuid, passError } from "@/lib/member-pass";

export function GetPassButton({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  if (!isUuid(eventId)) return null; // soirées de démonstration : pas de Pass
  if (!user) return <Link to="/auth" className="press mt-6 flex h-11 items-center justify-center rounded-xl border border-border text-sm font-semibold">Se connecter pour obtenir mon Pass</Link>;
  const get = async () => {
    const { error } = await supabase.rpc("issue_member_pass", { _event_id: eventId });
    if (error) setMsg(passError(error.message)); else setDone(true);
  };
  return (
    <div className="mt-6">
      {done ? (
        <Link to="/pass" className="press flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"><Sparkles className="h-4 w-4" />Voir mon Pass</Link>
      ) : (
        <button onClick={get} className="press flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground"><Sparkles className="h-4 w-4" />Obtenir mon Pass pour cette soirée</button>
      )}
      {msg && <p role="status" className="mt-2 text-xs text-muted-foreground">{msg}</p>}
    </div>
  );
}
