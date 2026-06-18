/** Deterministic weekly KPI scoring — stable per entity, varies by ISO week. */
export interface KpiDef {
  key: string;
  t: string;
  unit: string;
  target: number;
  better: "high" | "low";
  w: number;
}
export const KPI_DEFS: KpiDef[] = [
  { key: "pub", t: "On-time publishing", unit: "%", target: 95, better: "high", w: 0.22 },
  { key: "sla", t: "Exchange-SLA fulfilment", unit: "%", target: 90, better: "high", w: 0.26 },
  { key: "fresh", t: "Feed freshness & uptime", unit: "%", target: 99, better: "high", w: 0.2 },
  { key: "resp", t: "Avg request response", unit: "h", target: 24, better: "low", w: 0.16 },
  { key: "gov", t: "Governance compliance", unit: "%", target: 100, better: "high", w: 0.16 },
];

const GRADES: [number, string, string][] = [
  [96, "A", "#0a7d63"],
  [92, "A-", "#0a8f63"],
  [88, "B+", "#2563eb"],
  [84, "B", "#2f6bf0"],
  [80, "B-", "#6a5cff"],
  [72, "C", "#c96a12"],
  [0, "D", "#e0556a"],
];

export const KPI_STAT = {
  met: { l: "Met", c: "#0a7d63" },
  track: { l: "On track", c: "#2563eb" },
  below: { l: "Below target", c: "#c96a12" },
} as const;
export type KpiStatus = keyof typeof KPI_STAT;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function rng(seed: number): () => number {
  let x = (seed || 1) >>> 0 || 123456789;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 4294967296;
  };
}
export function isoWeek(d: Date): number {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - day + 3);
  const f = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((t.getTime() - f.getTime()) / 86400000 - 3 + ((f.getUTCDay() + 6) % 7)) / 7);
}
export function grade(score: number): { g: string; c: string } {
  for (const [m, g, c] of GRADES) if (score >= m) return { g, c };
  return { g: "D", c: "#e0556a" };
}

export interface ScoreRow {
  t: string;
  unit: string;
  target: number;
  better: "high" | "low";
  actual: number;
  status: KpiStatus;
  fill: number;
}
export function entityScore(abbr: string, wk: number): { score: number; rows: ScoreRow[] } {
  const comp = 0.8 + (hash(abbr) % 18) / 100;
  const r = rng(hash(abbr + "|w" + wk));
  let total = 0;
  let wsum = 0;
  const rows = KPI_DEFS.map((d) => {
    const a = Math.max(0.6, Math.min(1.05, comp + (r() - 0.4) * 0.14));
    const status: KpiStatus = a >= 1 ? "met" : a >= 0.9 ? "track" : "below";
    const actual =
      d.better === "high"
        ? Math.min(100, Math.round(d.target * a))
        : Math.round((d.target / a) * 10) / 10;
    total += Math.max(0, Math.min(1, a)) * d.w;
    wsum += d.w;
    return {
      t: d.t,
      unit: d.unit,
      target: d.target,
      better: d.better,
      actual,
      status,
      fill: Math.round(Math.min(1, a) * 100),
    };
  });
  return { score: Math.round((total / wsum) * 100), rows };
}
