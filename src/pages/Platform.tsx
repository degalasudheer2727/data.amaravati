import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader, type NavLink } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Disclaimer } from "../components/Disclaimer";
import { Reveal } from "../components/Reveal";
import { Icon } from "../components/Icon";
import { BtnLink, Btn, Card, ClassBadge, Em, Eyebrow, KpiStat, SectionHead } from "../components/ui";
import { ChakraMark } from "../lib/brand";
import { SUGGESTIONS } from "../features/assistant/engine";
import { useSession } from "../features/auth/session";
import { AuthFlowProvider, useAuthFlow } from "../features/auth/AuthFlow";
import { StakeholderScorecard, DecisionCockpit } from "./platform/Scorecards";
import { CLASS_TIERS } from "../lib/classification";
import {
  KPIS,
  PILLARS,
  PERSONAS,
  PERSONA_BY_KEY,
  DATASETS,
  ENTITIES,
  EXFLOW,
  EXCHANGES,
  EX_STATUS,
  TICKER,
  type Dataset,
} from "../data/platform";

const CLS_LEVEL: Record<string, string> = {
  open: "text-open",
  internal: "text-internal",
  sensitive: "text-sensitive",
  confidential: "text-confidential",
};

const NAV: NavLink[] = [
  { label: "Catalogue", href: "#catalogue" },
  { label: "Access & Trust", href: "#access" },
  { label: "Exchange Hub", href: "#exchange" },
  { label: "Decision Cockpit", href: "#cockpit" },
  { label: "Talk to AI", href: "/assistant" },
  { label: "Command Center", href: "/command-center" },
  { label: "Visit", href: "/visit" },
];

const FOOT_COLS = [
  {
    title: "Platform",
    links: [
      { label: "Data Catalogue", href: "#catalogue" },
      { label: "Access & Trust", href: "#access" },
      { label: "Exchange Hub", href: "#exchange" },
      { label: "Decision Cockpit", href: "#cockpit" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Command Center", href: "/command-center" },
      { label: "Visit Amaravati", href: "/visit" },
    ],
  },
  {
    title: "Standards",
    links: [
      { label: "GIGW & WCAG 2.1 AA", href: "#" },
      { label: "DPDP & consent", href: "#exchange" },
      { label: "Open data licence", href: "#catalogue" },
    ],
  },
];

export default function Platform() {
  return (
    <AuthFlowProvider>
      <PlatformInner />
    </AuthFlowProvider>
  );
}

function UserChip() {
  const { session } = useSession();
  const { openSignIn } = useAuthFlow();
  if (!session)
    return (
      <BtnLink to="/login" className="px-4 py-2 text-[13px]">
        Sign in
      </BtnLink>
    );
  const p = PERSONA_BY_KEY[session.persona];
  return (
    <button
      onClick={openSignIn}
      className="flex items-center gap-2.5 rounded-full border border-line bg-paper-2 py-1 pl-1 pr-3.5 text-left hover:border-brand"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">
        {(session.name || "U").charAt(0).toUpperCase()}
      </span>
      <span className="leading-tight">
        <span className="block text-[13px]">{(session.name || "You").split(" ")[0]}</span>
        <span className="block text-[9px] uppercase tracking-wide text-ink-faint">{p?.title}</span>
      </span>
    </button>
  );
}

function PlatformInner() {
  return (
    <div className="bg-paper">
      <SiteHeader links={NAV} rightSlot={<UserChip />} tone="light" />
      <main id="main">
        <Hero />
        <Ticker />
        <KpiStrip />
        <Pillars />
        <TalkToAi />
        <Catalogue />
        <Access />
        <Exchange />
        <Cockpit />
      </main>
      <SiteFooter
        blurb="The governed data platform & living digital twin of Amaravati — the People's Capital on the Krishna. A concept prototype."
        columns={FOOT_COLS}
      />
      <Disclaimer />
    </div>
  );
}

/* ---------- hero (clean Apple-style, content-first) ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft Apple gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_8%,rgb(var(--brand)/0.12),transparent_52%),radial-gradient(90%_70%_at_8%_28%,rgb(var(--green)/0.10),transparent_56%)]"
      />
      <div className="wrap relative flex min-h-[88svh] flex-col justify-center pb-24 pt-36">
        <Reveal>
          <Eyebrow className="mb-5">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green" />
            Governed Data Platform · People&rsquo;s Capital
          </Eyebrow>
          <h1 className="max-w-[18ch] text-balance text-[clamp(2.6rem,6.4vw,5rem)] font-bold leading-[1.04] tracking-[-0.035em]">
            One data platform for{" "}
            <span className="bg-gradient-to-r from-green to-brand bg-clip-text text-transparent">
              decisions, governance &amp; exchange.
            </span>
          </h1>
          <p className="mt-6 max-w-prose2 text-[clamp(1.1rem,1.6vw,1.32rem)] leading-[1.5] text-ink-muted">
            data.amaravati turns open, internal, sensitive and confidential city data into the
            insight officials use to decide and make policy, the KPIs that govern every entity, and a
            CRDA-governed exchange between them.
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <BtnLink to="#cockpit" className="px-6 py-3 text-[15px]">
              Open the Decision Cockpit
            </BtnLink>
            <BtnLink to="/assistant" variant="ghost" className="px-6 py-3 text-[15px]">
              Talk to AI
            </BtnLink>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2.5 text-[13px] text-ink-faint">
            {[
              "Open · Internal · Sensitive · Confidential",
              "Consent-bound & audit-logged",
              "CRDA-governed exchange",
            ].map((m) => (
              <span key={m} className="inline-flex items-center gap-2">
                <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- ticker ---------- */
function Ticker() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-b border-line-soft bg-paper-2">
      <div className="flex w-max animate-marquee gap-12 py-3 hover:[animation-play-state:paused]">
        {items.map((t, i) => {
          const [a, b] = t.split("·");
          return (
            <span key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap text-sm text-ink-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              {a}
              <strong className="font-serif font-normal text-ink">{b}</strong>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- kpi strip ---------- */
function KpiStrip() {
  return (
    <section className="wrap py-14">
      <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line-soft bg-line-soft md:grid-cols-4">
        {KPIS.map((k) => (
          <KpiStat key={k.label} value={k.value} unit={k.unit} label={k.label} />
        ))}
      </Reveal>
    </section>
  );
}

/* ---------- pillars ---------- */
function Pillars() {
  return (
    <section className="wrap py-10">
      <Reveal>
        <SectionHead
          kicker="The five pillars"
          title={
            <>
              Built on the <Em>fundamentals of digital transformation.</Em>
            </>
          }
        />
      </Reveal>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Reveal key={p.n} delay={i * 60}>
            <a href={p.href} className="group block h-full">
              <Card className="h-full hover:-translate-y-1 hover:border-brand">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-line-soft bg-paper text-brand">
                    <Icon name={p.icon} />
                  </span>
                  <span className="font-serif text-2xl text-line">{p.n}</span>
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{p.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand">
                  {p.cta} <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- talk to AI ---------- */
function TalkToAi() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const go = (text: string) => navigate(`/assistant${text ? `?q=${encodeURIComponent(text)}` : ""}`);
  return (
    <section id="assistant-cta" className="scroll-mt-24 py-10">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line-soft bg-gradient-to-br from-brand/10 via-paper-2 to-green/10 p-8 shadow-card sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
              <div>
                <span className="eyebrow mb-3.5">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green" /> AI Assistant
                </span>
                <h2 className="text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight">
                  <Em>Talk to</Em> the platform.
                </h2>
                <p className="mt-3.5 max-w-prose2 text-ink-muted">
                  Ask in plain language — the data.amaravati assistant explains the governed catalogue,
                  the four confidentiality tiers, how to request data and the CRDA exchange. Grounded
                  in the platform, consent-bound and audit-logged.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {SUGGESTIONS.slice(0, 4).map((s) => (
                    <button
                      key={s}
                      onClick={() => go(s)}
                      className="rounded-full border border-line-soft bg-paper/70 px-3.5 py-2 text-[13px] text-ink-muted backdrop-blur transition-colors hover:border-brand hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line-soft bg-paper/80 p-4 shadow-card backdrop-blur">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-line-soft bg-paper-2">
                    <ChakraMark className="h-5 w-5" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">data.amaravati Assistant</div>
                    <div className="flex items-center gap-1.5 text-2xs text-ink-faint">
                      <span className="h-1.5 w-1.5 rounded-full bg-green" /> Online · governed
                    </div>
                  </div>
                </div>
                <p className="rounded-xl rounded-tl-sm border border-line-soft bg-paper-2 px-3.5 py-3 text-sm text-ink-muted">
                  Namaste — ask me about datasets, access tiers, the exchange or live city figures.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    go(q);
                  }}
                  className="mt-3 flex items-center gap-2 rounded-xl border border-line-soft bg-paper-2 p-1.5 focus-within:border-brand"
                >
                  <label htmlFor="ai-teaser" className="sr-only">
                    Ask the assistant
                  </label>
                  <input
                    id="ai-teaser"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ask about datasets, access, the exchange…"
                    className="flex-1 bg-transparent px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Open the assistant"
                    className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-gradient-to-r from-green to-brand text-white"
                  >
                    <Icon name="send" className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- catalogue ---------- */
function reqLabel(persona: string | undefined, cls: Dataset["cls"]) {
  if (!persona) return "Request access";
  const a = PERSONA_BY_KEY[persona].access[cls];
  return a === "y" ? "Request · instant" : a === "c" ? "Request · agreement" : "Requires clearance";
}

function Catalogue() {
  const { session } = useSession();
  const { openRequest } = useAuthFlow();
  const [filter, setFilter] = useState<"all" | Dataset["cls"]>("all");
  const chips: { k: "all" | Dataset["cls"]; label: string }[] = [
    { k: "all", label: "All datasets" },
    ...CLASS_TIERS.map((c) => ({ k: c.key, label: c.title })),
  ];
  const list = DATASETS.filter((d) => filter === "all" || d.cls === filter);

  return (
    <section id="cockpit-anchor" className="scroll-mt-24 bg-paper-2 py-16">
      <div id="catalogue" className="wrap scroll-mt-24">
        <Reveal>
          <SectionHead
            kicker="Data & Interoperability"
            title={
              <>
                The governed <Em>data catalogue.</Em>
              </>
            }
            intro="Every dataset carries a format, cadence, owning department and a confidentiality class that decides who may request it."
          />
        </Reveal>
        <div className="mb-6 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.k}
              onClick={() => setFilter(c.k)}
              className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${
                filter === c.k
                  ? "border-transparent bg-brand font-semibold text-white"
                  : "border-line-soft bg-paper text-ink-muted hover:border-brand hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => {
            const closed = session && PERSONA_BY_KEY[session.persona].access[d.cls] === "n";
            return (
              <Card key={d.title} as="article" className="flex flex-col bg-paper">
                <div className="mb-2.5 flex items-start justify-between gap-3">
                  <span className="text-2xs uppercase tracking-wide text-ink-faint">{d.ent}</span>
                  <ClassBadge k={d.cls} />
                </div>
                <h4 className="text-base font-semibold leading-snug">{d.title}</h4>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{d.desc}</p>
                <div className="my-3.5 flex flex-wrap gap-1.5">
                  {[d.fmt, "↻ " + d.cad, d.owner].map((m) => (
                    <span key={m} className="rounded-full border border-line-soft bg-paper-2 px-2.5 py-1 font-mono text-2xs text-ink-muted">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="border-t border-line-soft pt-3.5">
                  <button
                    onClick={() => openRequest(d)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                      closed
                        ? "border-dashed border-line text-ink-muted hover:border-brand"
                        : "border-line bg-paper-2 text-ink hover:border-brand hover:text-brand"
                    }`}
                  >
                    <Icon name="lock" className="h-3.5 w-3.5" />
                    {reqLabel(session?.persona, d.cls)}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- access & trust ---------- */
function Access() {
  return (
    <section id="access" className="scroll-mt-24 py-16">
      <div className="wrap">
        <Reveal>
          <SectionHead
            kicker="Trust, Security & Governance"
            title={
              <>
                Right data, <Em>right authority.</Em>
              </>
            }
            intro="Every dataset is graded across four tiers. Your authority — not your team — decides what you reach, the consent required and the audit kept."
          />
        </Reveal>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {CLASS_TIERS.map((c) => (
            <div
              key={c.key}
              className="rounded-card border border-line-soft bg-paper-2 p-6 shadow-card"
              style={{ borderLeft: `3px solid rgb(var(--cls-${c.key}))` }}
            >
              <span className={`text-2xs font-semibold uppercase tracking-wide ${CLS_LEVEL[c.key]}`}>
                {c.level}
              </span>
              <h4 className="my-2 flex items-center gap-2 text-base font-semibold">
                <ClassBadge k={c.key} />
              </h4>
              <p className="text-sm text-ink-muted">{c.desc}</p>
              <p className="mt-3 border-t border-line-soft pt-3 text-2xs text-ink-faint">{c.path}</p>
            </div>
          ))}
        </div>

        <Reveal className="mt-14">
          <SectionHead
            kicker="Personas"
            title={
              <>
                One catalogue, <Em>many entities.</Em>
              </>
            }
          />
        </Reveal>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((p) => (
            <Card key={p.key}>
              <h4 className="text-base font-semibold">{p.title}</h4>
              <p className="mt-1.5 text-sm text-ink-muted">{p.desc}</p>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {CLASS_TIERS.map((c) => {
                  const a = p.access[c.key];
                  return a === "n" ? null : (
                    <ClassBadge key={c.key} k={c.key} suffix={a === "c" ? "agreement" : undefined} />
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        <Reveal className="mt-14">
          <SectionHead
            kicker="The access matrix"
            title={
              <>
                Persona <Em>×</Em> confidentiality.
              </>
            }
          />
        </Reveal>
        <div className="overflow-x-auto rounded-card border border-line-soft bg-paper">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-b border-line-soft">
                <th className="p-3.5 text-left text-2xs uppercase tracking-wide text-ink-faint">Persona</th>
                {CLASS_TIERS.map((c) => (
                  <th key={c.key} className="p-3.5 text-center">
                    <ClassBadge k={c.key} className="border-none px-0" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERSONAS.map((p) => (
                <tr key={p.key} className="border-b border-line-soft last:border-0 hover:bg-paper-2">
                  <th className="whitespace-nowrap p-3.5 text-left font-semibold">{p.title}</th>
                  {CLASS_TIERS.map((c) => {
                    const a = p.access[c.key];
                    return (
                      <td key={c.key} className="p-3.5 text-center">
                        {a === "y" ? (
                          <span className="text-green">●</span>
                        ) : a === "c" ? (
                          <span className="text-2xs text-sensitive">agreement</span>
                        ) : (
                          <span className="text-ink-faint opacity-50">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------- exchange hub ---------- */
function Exchange() {
  const { openExchange } = useAuthFlow();
  return (
    <section id="exchange" className="scroll-mt-24 bg-paper-2 py-16">
      <div className="wrap">
        <Reveal>
          <SectionHead
            kicker="Data Exchange Hub · governed by CRDA"
            title={
              <>
                Government data, <Em>exchanged under governance.</Em>
              </>
            }
            intro="One place for every entity to request and provide data, with CRDA classifying it, approving sensitive exchanges and auditing every transaction."
          />
        </Reveal>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {EXFLOW.map((s) => (
            <div key={s.n} className={`rounded-card border bg-paper p-5 ${s.gov ? "border-gold/60" : "border-line-soft"}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-serif text-xl text-brand">{s.n}</span>
                {s.gov && <span className="rounded-full border border-line px-2 py-0.5 text-[8px] uppercase tracking-wide text-ink-faint">CRDA</span>}
              </div>
              <h4 className="text-sm font-semibold">{s.title}</h4>
              <p className="mt-1.5 text-2xs leading-relaxed text-ink-muted">{s.desc}</p>
            </div>
          ))}
        </div>

        <Reveal className="mt-14">
          <SectionHead kicker="Participating entities" title={<>Providers &amp; <Em>consumers.</Em></>} />
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ENTITIES.map((e) => (
            <div key={e.abbr} className={`relative rounded-card border bg-paper p-4 ${e.gov ? "border-gold/60" : "border-line-soft"}`}>
              {e.gov && <span className="absolute right-3 top-3 rounded-full border border-line px-2 py-0.5 text-[8px] uppercase tracking-wide text-ink-faint">Governs</span>}
              <div className="mb-2 flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-line-soft bg-paper-2 text-ink-muted">
                  <Icon name="building" className="h-5 w-5" />
                </span>
                <b className="font-serif text-base">{e.abbr}</b>
              </div>
              <h4 className="text-sm font-semibold leading-snug">{e.name}</h4>
              <div className="mt-1 text-2xs uppercase tracking-wide text-ink-faint">{e.role}</div>
              <div className="mt-3 flex gap-6 border-t border-line-soft pt-2.5 text-2xs text-ink-muted">
                <span><b className="block font-serif text-base text-ink">{e.pub}</b>Published</span>
                <span><b className="block font-serif text-base text-ink">{e.con}</b>Consumed</span>
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-14">
          <SectionHead kicker="The exchange register" title={<>Live inter-agency <Em>agreements.</Em></>} />
        </Reveal>
        <div className="overflow-x-auto rounded-card border border-line-soft bg-paper">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line-soft text-left text-2xs uppercase tracking-wide text-ink-faint">
                <th className="p-3.5 font-semibold">Exchange</th>
                <th className="p-3.5 font-semibold">Dataset</th>
                <th className="p-3.5 font-semibold">Class</th>
                <th className="p-3.5 font-semibold">Purpose</th>
                <th className="p-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {EXCHANGES.map((x, i) => {
                const st = EX_STATUS[x.status];
                return (
                  <tr key={i} className="border-b border-line-soft last:border-0 hover:bg-paper-2">
                    <td className="whitespace-nowrap p-3.5">
                      <span className="font-semibold">{x.prov}</span>
                      <span className="mx-1.5 text-gold">→</span>
                      <span className="font-semibold">{x.con}</span>
                    </td>
                    <td className="p-3.5">{x.ds}</td>
                    <td className="p-3.5"><ClassBadge k={x.cls} /></td>
                    <td className="p-3.5 text-ink-muted">{x.purpose}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border border-current px-2.5 py-0.5 text-2xs font-semibold ${st.token}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" /> {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Reveal className="mt-14">
          <SectionHead kicker="Stakeholder performance · weekly KPIs" title={<>Every entity, <Em>scored on its KPIs.</Em></>} />
        </Reveal>
        <StakeholderScorecard />

        <div className="mt-8 text-center">
          <Btn onClick={openExchange}>Propose an exchange →</Btn>
        </div>
      </div>
    </section>
  );
}

/* ---------- decision cockpit ---------- */
function Cockpit() {
  return (
    <section id="cockpit" className="scroll-mt-24 py-16">
      <div className="wrap">
        <Reveal>
          <SectionHead
            kicker="Decision Cockpit · leadership oversight"
            title={
              <>
                Decisions, <Em>governed by data.</Em>
              </>
            }
            intro="A city-wide view of every government entity's performance, the insights that drive policy, and the signals that need a decision this week. Restricted to leadership."
          />
        </Reveal>
        <DecisionCockpit />
      </div>
    </section>
  );
}
