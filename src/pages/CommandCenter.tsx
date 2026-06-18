import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { A11yControls } from "../components/A11yControls";
import { Icon } from "../components/Icon";
import { Wordmark } from "../lib/brand";
import { ClassBadge } from "../components/ui";

/* ----------------------------------------------------------------------------
   data.amaravati — Command Center
   Concept mission-control console for the governed city-data platform & twin.
   All page-specific data is defined inline below.
---------------------------------------------------------------------------- */

type LayerKey =
  | "land"
  | "mobility"
  | "water"
  | "energy"
  | "env"
  | "safety"
  | "economy"
  | "gov";

type Layer = {
  key: LayerKey;
  title: string;
  color: string;
  ratio: number;
  unit: string;
};

const LAYERS: Layer[] = [
  { key: "land", title: "Land & Zoning", color: "#ffb454", ratio: 0.74, unit: "% mapped" },
  { key: "mobility", title: "Mobility", color: "#4d8dff", ratio: 0.62, unit: "flow idx" },
  { key: "water", title: "Water & River", color: "#33d0e0", ratio: 0.96, unit: "% uptime" },
  { key: "energy", title: "Energy", color: "#ffd24d", ratio: 0.71, unit: "grid load" },
  { key: "env", title: "Environment", color: "#33e0b6", ratio: 0.83, unit: "AQI good" },
  { key: "safety", title: "Safety", color: "#ff6b8a", ratio: 0.9, unit: "response" },
  { key: "economy", title: "Economy", color: "#9b8cff", ratio: 0.66, unit: "GVA idx" },
  { key: "gov", title: "Governance", color: "#7ad0ff", ratio: 0.78, unit: "% digital" },
];

type District = {
  name: string;
  color: string;
  ds: number;
  act: number;
};

const DISTRICTS: District[] = [
  { name: "Government City", color: "#ff9933", ds: 142, act: 0.8 },
  { name: "Justice City", color: "#e7c46b", ds: 64, act: 0.5 },
  { name: "Finance City", color: "#33e0b6", ds: 88, act: 0.66 },
  { name: "Knowledge City", color: "#4d8dff", ds: 121, act: 0.74 },
  { name: "Health City", color: "#ff6b8a", ds: 77, act: 0.6 },
  { name: "Sports City", color: "#33d0e0", ds: 39, act: 0.4 },
  { name: "Media City", color: "#9b8cff", ds: 45, act: 0.45 },
  { name: "Tourism City", color: "#ffb454", ds: 58, act: 0.7 },
  { name: "Quantum Valley", color: "#7ad0ff", ds: 96, act: 0.9 },
];

type Kpi = { label: string; value: string; delta: string };

const KPIS: Kpi[] = [
  { label: "Open datasets", value: "1,240", delta: "+18 today" },
  { label: "Active exchanges", value: "6", delta: "2 in review" },
  { label: "City KPI index", value: "87/100", delta: "▲ +1 w/w" },
  { label: "Riverfront level", value: "12.4 m", delta: "stable" },
];

type SignalIcon = "exchange" | "database" | "shield" | "gauge" | "bolt";
type Signal = { id: number; icon: SignalIcon; title: string; sub: string; time: string };

const INITIAL_SIGNALS: Omit<Signal, "id">[] = [
  { icon: "exchange", title: "Exchange approved", sub: "DTCP → APCRDA · Layout Sanctions", time: "2m" },
  { icon: "database", title: "Dataset published", sub: "Air Quality Index (CAAQMS) · open", time: "9m" },
  { icon: "gauge", title: "Threshold alert", sub: "Inner Ring Road · congestion rising", time: "14m" },
  { icon: "shield", title: "CRDA review opened", sub: "ANPR Vehicle Movements · restricted", time: "22m" },
  { icon: "bolt", title: "KPI updated", sub: "Quantum Valley ▲ +4 this week", time: "31m" },
];

const SIGNAL_POOL: { icon: SignalIcon; title: string; sub: string }[] = [
  { icon: "database", title: "Telemetry sync", sub: "Reservoir SCADA · pressure nominal" },
  { icon: "gauge", title: "Sensor reading", sub: "Green canopy cover · 31%" },
  { icon: "bolt", title: "Transit pulse", sub: "APSRTC positions · 15s refresh" },
  { icon: "shield", title: "Works progress", sub: "Government Complex · 64% complete" },
  { icon: "exchange", title: "Response time", sub: "Emergency · 7.8 min average" },
];

const TICKER: string[] = [
  "Datasets 1,240",
  "Exchanges 6 active",
  "AQI 71 · Good",
  "Riverfront 12.4 m",
  "Solar 1.9 GWh",
  "Transit +6.2%",
  "Canopy 31%",
  "KPI index 87",
];

type TierKey = "open" | "internal" | "sensitive" | "confidential";
type Tier = { k: TierKey; title: string; color: string; desc: string };

const TIERS: Tier[] = [
  { k: "open", title: "Open", color: "#33e0b6", desc: "Anyone can use, share and build on under an open licence." },
  { k: "internal", title: "Internal", color: "#4d8dff", desc: "Shared across agencies and verified partners; access logged." },
  { k: "sensitive", title: "Sensitive", color: "#ffb454", desc: "Needs a data-sharing agreement and purpose review." },
  { k: "confidential", title: "Confidential", color: "#ff6b8a", desc: "Strict need-to-know; DPO approval and full audit." },
];

type MapMode = "layers" | "activity";

/* ---- command palette command model ---- */
type Command = {
  id: string;
  icon: string;
  title: string;
  sub: string;
  run: () => void;
};

/* layout positions for the SVG twin map (3×3 grid) */
const MAP_POS: { x: number; y: number }[] = [
  { x: 30, y: 70 }, { x: 220, y: 70 }, { x: 410, y: 70 },
  { x: 30, y: 165 }, { x: 220, y: 165 }, { x: 410, y: 165 },
  { x: 30, y: 260 }, { x: 220, y: 260 }, { x: 410, y: 260 },
];
const CELL_W = 160;
const CELL_H = 78;

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function CommandCenter() {
  const [layerOn, setLayerOn] = useState<Record<LayerKey, boolean>>(() =>
    LAYERS.reduce(
      (acc, l) => ({ ...acc, [l.key]: true }),
      {} as Record<LayerKey, boolean>,
    ),
  );
  const [selected, setSelected] = useState<string>("Finance City");
  const [mapMode, setMapMode] = useState<MapMode>("layers");
  const [signals, setSignals] = useState<Signal[]>(() =>
    INITIAL_SIGNALS.map((s, i) => ({ ...s, id: i })),
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const nextId = useRef(INITIAL_SIGNALS.length);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeLayerCount = useMemo(
    () => LAYERS.filter((l) => layerOn[l.key]).length,
    [layerOn],
  );

  const toggleLayer = (k: LayerKey) =>
    setLayerOn((prev) => ({ ...prev, [k]: !prev[k] }));

  const allLayersOn = () =>
    setLayerOn(
      LAYERS.reduce(
        (acc, l) => ({ ...acc, [l.key]: true }),
        {} as Record<LayerKey, boolean>,
      ),
    );

  const selectedDistrict = useMemo(
    () => DISTRICTS.find((d) => d.name === selected) ?? DISTRICTS[0],
    [selected],
  );

  /* ---- live signal injection every 7s ---- */
  useEffect(() => {
    const id = window.setInterval(() => {
      setSignals((prev) => {
        const pick = SIGNAL_POOL[Math.floor(Math.random() * SIGNAL_POOL.length)];
        const fresh: Signal = { ...pick, id: nextId.current++, time: "now" };
        return [fresh, ...prev].slice(0, 9);
      });
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  /* ---- command palette command list (built once per relevant state) ---- */
  const commands = useMemo<Command[]>(() => {
    const base: Command[] = [
      {
        id: "cmd-catalogue",
        icon: "database",
        title: "Open Data Catalogue",
        sub: "Browse governed datasets",
        run: () => {
          window.location.hash = "#catalogue";
        },
      },
      {
        id: "cmd-exchange",
        icon: "exchange",
        title: "Open Exchange register",
        sub: "Inter-agency agreements",
        run: () => {
          window.location.hash = "#exchange";
        },
      },
      {
        id: "cmd-access",
        icon: "lock",
        title: "Open Governance & access",
        sub: "Classification & tiers",
        run: () => {
          window.location.hash = "#access";
        },
      },
      {
        id: "cmd-alllayers",
        icon: "layers",
        title: "Show all layers",
        sub: "Reset data layers",
        run: () => allLayersOn(),
      },
      {
        id: "cmd-mode-activity",
        icon: "gauge",
        title: "Switch to Activity heatmap",
        sub: "Map mode",
        run: () => setMapMode("activity"),
      },
      {
        id: "cmd-mode-layers",
        icon: "map",
        title: "Switch to Layers view",
        sub: "Map mode",
        run: () => setMapMode("layers"),
      },
    ];
    const districtCmds: Command[] = DISTRICTS.map((d) => ({
      id: `dist-${d.name}`,
      icon: "building",
      title: d.name,
      sub: `Focus district · ${d.ds} datasets`,
      run: () => setSelected(d.name),
    }));
    const layerCmds: Command[] = LAYERS.map((l) => ({
      id: `layer-${l.key}`,
      icon: "layers",
      title: `Toggle ${l.title}`,
      sub: "Data layer",
      run: () => toggleLayer(l.key),
    }));
    return [...base, ...districtCmds, ...layerCmds];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q),
    );
  }, [query, commands]);

  const openPalette = () => {
    setQuery("");
    setCursor(0);
    setPaletteOpen(true);
  };
  const closePalette = () => setPaletteOpen(false);

  /* ---- global ⌘K / Ctrl+K + esc ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => {
          if (!o) {
            setQuery("");
            setCursor(0);
          }
          return !o;
        });
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (paletteOpen) inputRef.current?.focus();
  }, [paletteOpen]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  const runCommand = (c: Command | undefined) => {
    if (!c) return;
    c.run();
    closePalette();
  };

  const onPaletteKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, Math.max(0, filtered.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[cursor]);
    }
  };

  const mapSubLabel =
    mapMode === "activity"
      ? "activity heatmap"
      : activeLayerCount === LAYERS.length
        ? "all layers · live"
        : `${activeLayerCount} layers · live`;

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      {/* ---------- TOP BAR ---------- */}
      <header className="sticky top-0 z-30 border-b border-line-soft bg-paper/95 backdrop-blur">
        <div className="wrap flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <Link
            to="/"
            className="flex-none rounded-md focus-visible:outline-3"
            aria-label="data.amaravati home"
          >
            <Wordmark subtitle="Command Center" />
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-line-soft bg-paper-2 px-3 py-1 font-mono text-2xs uppercase tracking-wide text-ink-muted">
            <span className="relative flex h-2 w-2">
              {!reducedMotion() && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-70" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
            </span>
            Live twin
          </span>

          <button
            type="button"
            onClick={openPalette}
            className="group ml-auto inline-flex min-h-[40px] items-center gap-2 rounded-full border border-line-soft bg-paper-2 px-4 py-1.5 text-sm text-ink-faint transition-colors hover:border-line hover:text-ink-muted focus-visible:outline-3 cursor-pointer"
            aria-label="Open command palette"
          >
            <Icon name="terminal" className="h-4 w-4" />
            <span className="font-mono">Search city, commands…</span>
            <kbd className="ml-2 rounded border border-line-soft bg-paper px-1.5 py-0.5 font-mono text-2xs text-ink-muted">
              ⌘K
            </kbd>
          </button>

          <A11yControls />

          <nav className="flex items-center gap-2" aria-label="Cross links">
            <Link
              to="/"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line-soft bg-paper-2 px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-3"
            >
              <Icon name="gauge" className="h-4 w-4" />
              Glass dashboard
            </Link>
            <Link
              to="/visit"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-line-soft bg-paper-2 px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-3"
            >
              <Icon name="map" className="h-4 w-4" />
              Visit
            </Link>
          </nav>
        </div>
      </header>

      {/* ---------- MAIN GRID ---------- */}
      <main className="wrap grid flex-1 grid-cols-1 gap-5 py-6 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        {/* LEFT — data layers */}
        <aside className="order-2 lg:order-1">
          <div className="rounded-card border border-line-soft bg-paper-2 p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="layers" className="h-4 w-4 text-brand" />
              <h2 className="font-mono text-2xs uppercase tracking-wide text-ink-muted">
                Data layers
              </h2>
              <span className="ml-auto font-mono text-2xs tabular text-ink-faint">
                {activeLayerCount}/{LAYERS.length}
              </span>
            </div>
            <ul className="space-y-1.5">
              {LAYERS.map((l) => {
                const on = layerOn[l.key];
                return (
                  <li key={l.key}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleLayer(l.key)}
                      className="flex w-full min-h-[44px] items-center gap-3 rounded-card border border-line-soft bg-paper px-3 py-2 text-left transition-colors hover:border-line focus-visible:outline-3 cursor-pointer"
                    >
                      <span
                        className="h-3 w-3 flex-none rounded-full border border-line-soft transition-opacity"
                        style={{
                          backgroundColor: l.color,
                          opacity: on ? 1 : 0.25,
                        }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className="block truncate text-sm font-medium"
                          style={{ opacity: on ? 1 : 0.55 }}
                        >
                          {l.title}
                        </span>
                        <span className="block font-mono text-2xs text-ink-faint">
                          {l.unit}
                        </span>
                      </span>
                      <span className="flex-none text-right">
                        <span className="block font-mono text-sm tabular text-ink">
                          {Math.round(l.ratio * 100)}
                        </span>
                        <span className="block font-mono text-2xs uppercase text-ink-faint">
                          {on ? "on" : "off"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* CENTER — twin map + KPI grid */}
        <section className="order-1 min-w-0 lg:order-2">
          <div className="rounded-card border border-line-soft bg-paper-2 p-4 shadow-card">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div>
                <h1 className="font-serif text-xl leading-none">Digital twin</h1>
                <p className="mt-1 font-mono text-2xs uppercase tracking-wide text-ink-faint">
                  {mapSubLabel}
                </p>
              </div>
              <div
                className="ml-auto inline-flex overflow-hidden rounded-full border border-line-soft bg-paper"
                role="group"
                aria-label="Map mode"
              >
                {(["layers", "activity"] as MapMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={mapMode === m}
                    onClick={() => setMapMode(m)}
                    className={`px-3 py-1.5 font-mono text-2xs uppercase tracking-wide transition-colors focus-visible:outline-3 cursor-pointer ${
                      mapMode === m
                        ? "bg-brand text-white"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {m === "layers" ? "Layers" : "Activity"}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG twin map */}
            <div className="rounded-card border border-line-soft bg-paper">
              <TwinMap
                mode={mapMode}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          </div>

          {/* KPI grid */}
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {KPIS.map((k) => (
              <KpiCard key={k.label} kpi={k} />
            ))}
          </div>

          {/* governance legend */}
          <div className="mt-5 rounded-card border border-line-soft bg-paper-2 p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="shield" className="h-4 w-4 text-brand" />
              <h2 className="font-mono text-2xs uppercase tracking-wide text-ink-muted">
                Governance tiers
              </h2>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TIERS.map((t) => (
                <li key={t.k} className="flex gap-3">
                  <ClassBadge k={t.k} />
                  <p className="min-w-0 flex-1 text-xs text-ink-muted">{t.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT — district focus + live signals */}
        <aside className="order-3 space-y-5">
          {/* District focus */}
          <div className="rounded-card border border-line-soft bg-paper-2 p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="building" className="h-4 w-4 text-brand" />
              <h2 className="font-mono text-2xs uppercase tracking-wide text-ink-muted">
                District focus
              </h2>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="h-4 w-4 flex-none rounded-full border border-line-soft"
                style={{ backgroundColor: selectedDistrict.color }}
                aria-hidden
              />
              <span className="font-serif text-lg leading-none">
                {selectedDistrict.name}
              </span>
            </div>
            <p className="mt-2 font-mono text-2xs text-ink-muted">
              {selectedDistrict.ds} governed datasets · activity{" "}
              {Math.round(selectedDistrict.act * 100)}%
            </p>
            <ul className="mt-4 space-y-2.5">
              {LAYERS.map((l) => (
                <li key={l.key}>
                  <div className="mb-1 flex items-center justify-between gap-2 font-mono text-2xs text-ink-faint">
                    <span className="text-ink-muted">{l.title}</span>
                    <span className="tabular text-ink">
                      {Math.round(l.ratio * 100)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(l.ratio * 100)}%`,
                        backgroundColor: l.color,
                        opacity: layerOn[l.key] ? 1 : 0.3,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Live signals */}
          <div className="rounded-card border border-line-soft bg-paper-2 p-4 shadow-card">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="spark" className="h-4 w-4 text-brand" />
              <h2 className="font-mono text-2xs uppercase tracking-wide text-ink-muted">
                Live signals
              </h2>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-2xs text-ink-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-green" aria-hidden />
                streaming
              </span>
            </div>
            <ul className="space-y-2" aria-live="polite">
              {signals.map((s) => (
                <li
                  key={s.id}
                  className="flex items-start gap-3 rounded-card border border-line-soft bg-paper px-3 py-2"
                >
                  <span className="mt-0.5 flex-none text-brand">
                    <Icon name={s.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">
                      {s.title}
                    </span>
                    <span className="block truncate font-mono text-2xs text-ink-muted">
                      {s.sub}
                    </span>
                  </span>
                  <span className="flex-none font-mono text-2xs tabular text-ink-faint">
                    {s.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* ---------- BOTTOM TICKER ---------- */}
      <div className="border-y border-line-soft bg-paper-2">
        <div className="wrap overflow-hidden py-2">
          <div
            className={`flex w-max gap-8 ${reducedMotion() ? "" : "animate-marquee"}`}
            aria-hidden={!reducedMotion()}
          >
            {[...TICKER, ...TICKER].map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-2xs uppercase tracking-wide text-ink-muted"
              >
                <span className="h-1 w-1 rounded-full bg-brand" aria-hidden />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-line-soft bg-paper">
        <div className="wrap py-4">
          <p className="max-w-prose2 text-2xs leading-relaxed text-ink-faint">
            Amaravati Data Command Center is a concept mission-control view of the
            governed city-data platform and digital twin. Concept prototype — not an
            official product. data.amaravati is an independent concept inspired by the
            public Amaravati master plan and the spirit of CRDA's data-governance
            vision. It is not a Government of Andhra Pradesh or APCRDA product and is
            not endorsed by either. It uses no official State Emblem or copyrighted
            master-plan artwork; the twin is an original interpretation and all figures
            are indicative. © 2026 data.amaravati concept.
          </p>
        </div>
      </footer>

      {/* ---------- COMMAND PALETTE ---------- */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-navy/40 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={closePalette}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden rounded-card border border-line bg-paper shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
              <Icon name="terminal" className="h-4 w-4 text-ink-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onPaletteKey}
                placeholder="Search city, commands…"
                aria-label="Search commands, districts and layers"
                className="w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <button
                type="button"
                onClick={closePalette}
                aria-label="Close command palette"
                className="rounded-md border border-line-soft px-1.5 py-0.5 font-mono text-2xs text-ink-muted hover:text-ink focus-visible:outline-3 cursor-pointer"
              >
                esc
              </button>
            </div>

            <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center font-mono text-2xs text-ink-faint">
                  No matches
                </li>
              )}
              {filtered.map((c, i) => (
                <li key={c.id} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => runCommand(c)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors focus-visible:outline-3 cursor-pointer ${
                      i === cursor ? "bg-paper-2" : "hover:bg-paper-2/60"
                    }`}
                  >
                    <span className="flex-none text-brand">
                      <Icon name={c.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">
                        {c.title}
                      </span>
                      <span className="block truncate font-mono text-2xs text-ink-muted">
                        {c.sub}
                      </span>
                    </span>
                    <Icon
                      name="arrow"
                      className="h-3.5 w-3.5 flex-none text-ink-faint"
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 border-t border-line-soft px-4 py-2 font-mono text-2xs text-ink-faint">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   KPI card with optional reduced-motion-guarded count-up.
--------------------------------------------------------------------------- */
function KpiCard({ kpi }: { kpi: Kpi }) {
  const [display, setDisplay] = useState<string>(() =>
    reducedMotion() ? kpi.value : seedZero(kpi.value),
  );

  useEffect(() => {
    if (reducedMotion()) {
      setDisplay(kpi.value);
      return;
    }
    const m = kpi.value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m) {
      setDisplay(kpi.value);
      return;
    }
    const target = parseFloat(m[1].replace(/,/g, ""));
    const suffix = m[2];
    const decimals = m[1].includes(".") ? m[1].split(".")[1].length : 0;
    const grouped = m[1].includes(",");
    const start = performance.now();
    const dur = 750;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      const num = v.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouped,
      });
      setDisplay(num + suffix);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [kpi.value]);

  return (
    <div className="rounded-card border border-line-soft bg-paper-2 p-4 shadow-card">
      <div className="font-mono text-2xs uppercase tracking-wide text-ink-faint">
        {kpi.label}
      </div>
      <div className="mt-1.5 font-serif text-2xl leading-none tabular text-ink">
        {display}
      </div>
      <div className="mt-1.5 font-mono text-2xs text-green">{kpi.delta}</div>
    </div>
  );
}

function seedZero(value: string): string {
  return value.replace(/[\d]/g, "0");
}

/* ---------------------------------------------------------------------------
   The SVG digital twin map.
--------------------------------------------------------------------------- */
function TwinMap({
  mode,
  selected,
  onSelect,
}: {
  mode: MapMode;
  selected: string;
  onSelect: (name: string) => void;
}) {
  const activityFill = (act: number): string =>
    act > 0.66 ? "#33e0b6" : act > 0.45 ? "#ffb454" : "#ff6b8a";

  return (
    <svg
      viewBox="0 0 600 360"
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="Amaravati digital twin map — nine theme districts"
    >
      {/* Krishna riverfront band */}
      <path
        d="M0 318 C 140 300, 300 348, 460 318 C 540 304, 600 320, 600 320 L 600 360 L 0 360 Z"
        fill="#33d0e0"
        opacity="0.16"
      />
      <path
        d="M0 318 C 140 300, 300 348, 460 318 C 540 304, 600 320, 600 320"
        fill="none"
        stroke="#33d0e0"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* saffron dashed riverfront diagonal */}
      <line
        x1="20"
        y1="345"
        x2="580"
        y2="305"
        stroke="#ff9933"
        strokeWidth="2"
        strokeDasharray="6 6"
        opacity="0.6"
      />
      <text
        x="300"
        y="350"
        textAnchor="middle"
        className="font-mono"
        fontSize="11"
        letterSpacing="2"
        fill="#0a1f44"
        opacity="0.55"
      >
        KRISHNA RIVERFRONT
      </text>

      {/* districts */}
      {DISTRICTS.map((d, i) => {
        const pos = MAP_POS[i];
        const isSel = d.name === selected;
        const fill = mode === "activity" ? activityFill(d.act) : d.color;
        const opacity = mode === "activity" ? 0.35 + d.act * 0.6 : 0.9;
        const first = d.name.split(" ")[0];
        return (
          <g
            key={d.name}
            role="button"
            tabIndex={0}
            aria-label={`${d.name}, ${d.ds} datasets, activity ${Math.round(
              d.act * 100,
            )} percent`}
            aria-pressed={isSel}
            onClick={() => onSelect(d.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(d.name);
              }
            }}
            className="cursor-pointer focus-visible:outline-none"
            style={{ outline: "none" }}
          >
            <rect
              x={pos.x}
              y={pos.y}
              width={CELL_W}
              height={CELL_H}
              rx={10}
              fill={fill}
              fillOpacity={opacity}
              stroke={isSel ? "#0a1f44" : "#ffffff"}
              strokeWidth={isSel ? 3 : 1}
              strokeOpacity={isSel ? 0.9 : 0.5}
            />
            <text
              x={pos.x + 12}
              y={pos.y + 30}
              fontSize="14"
              fontWeight="600"
              fill="#0a1f44"
              opacity="0.92"
            >
              {first}
            </text>
            <text
              x={pos.x + 12}
              y={pos.y + 52}
              className="font-mono"
              fontSize="10"
              fill="#0a1f44"
              opacity="0.7"
            >
              {d.ds} sets
            </text>
          </g>
        );
      })}
    </svg>
  );
}
