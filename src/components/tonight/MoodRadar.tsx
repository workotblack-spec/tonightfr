import { MOMENTS, COMPANIES, RADII, type Moment, type Company, type Radius } from "@/lib/radar";

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`press whitespace-nowrap rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function MoodRadar(props: {
  moment: Moment;
  setMoment: (m: Moment) => void;
  company: Company;
  setCompany: (c: Company) => void;
  radius: Radius;
  setRadius: (r: Radius) => void;
  hasGps: boolean;
}) {
  return (
    <div className="space-y-2.5">
      <Row label="Envie">
        {MOMENTS.map((m) => (
          <Pill key={m.key} active={props.moment === m.key} onClick={() => props.setMoment(m.key)}>{m.label}</Pill>
        ))}
      </Row>
      <Row label="Avec qui">
        {COMPANIES.map((c) => (
          <Pill key={c.key} active={props.company === c.key} onClick={() => props.setCompany(c.key)}>{c.label}</Pill>
        ))}
      </Row>
      {props.hasGps && (
        <Row label="Rayon">
          {RADII.map((r) => (
            <Pill key={String(r.key)} active={props.radius === r.key} onClick={() => props.setRadius(r.key)}>{r.label}</Pill>
          ))}
        </Row>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-5 flex items-center gap-2 overflow-x-auto px-5">
      <span className="label-xs w-16 shrink-0 text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
