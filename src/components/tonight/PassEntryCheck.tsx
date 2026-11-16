import { useEffect, useRef, useState } from "react";
import { Camera, ScanLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ENTRY_RESULT } from "@/lib/member-pass";

export function PassEntryCheck() {
  const [code, setCode] = useState("");
  const [res, setRes] = useState<{ ok: boolean; label: string; title?: string | null } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [canScan, setCanScan] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => { setCanScan("BarcodeDetector" in window); }, []);
  useEffect(() => {
    if (!scanning) return;
    let stream: MediaStream | null = null; let stop = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!video.current) return;
        video.current.srcObject = stream; await video.current.play();
        // @ts-expect-error API navigateur pas encore typée
        const det = new window.BarcodeDetector({ formats: ["qr_code"] });
        while (!stop) {
          const found = await det.detect(video.current).catch(() => []);
          if (found[0]?.rawValue) { stop = true; setScanning(false); await check(found[0].rawValue); break; }
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch { setScanning(false); setRes({ ok: false, label: "Caméra indisponible — saisissez le code." }); }
    })();
    return () => { stop = true; stream?.getTracks().forEach((t) => t.stop()); };
  }, [scanning]);
  const check = async (value = code) => {
    const { data, error } = await supabase.rpc("validate_member_pass", { _code: value });
    const row = data?.[0];
    const r = error || !row ? ENTRY_RESULT.invalid : ENTRY_RESULT[row.result] ?? ENTRY_RESULT.invalid;
    setRes({ ...r, title: row?.event_title });
    setCode("");
  };
  return (
    <section className="mt-6 rounded-2xl border border-border bg-surface/60 p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><ScanLine className="h-4 w-4 text-primary" />Contrôle à l’entrée</h2>
      <p className="mt-1 text-xs text-muted-foreground">Saisissez le code affiché sur le Pass du membre. Chaque Pass ne passe qu’une fois.</p>
      <div className="mt-3 flex gap-2">
        <input aria-label="Code du Pass" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXXXXXXXXXX-XXXXXXXX" className="h-11 flex-1 rounded-xl border border-border bg-background px-3 font-mono text-sm uppercase" />
        <button onClick={() => check()} disabled={code.trim().length < 21} className="press h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">Vérifier</button>
      </div>
      {canScan && <button onClick={() => setScanning((v) => !v)} className="press mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold"><Camera className="h-4 w-4" />{scanning ? "Arrêter la caméra" : "Scanner avec la caméra"}</button>}
      {scanning && <video ref={video} muted playsInline className="mt-3 w-full rounded-xl" />}
      {res && <p role="status" className={`mt-3 rounded-xl p-3 text-sm font-semibold ${res.ok ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>{res.label}{res.title ? ` · ${res.title}` : ""}</p>}
    </section>
  );
}
