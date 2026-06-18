import { useMemo, useState } from "react";
import { SiteHeader, type NavLink } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Disclaimer } from "../components/Disclaimer";
import { Reveal } from "../components/Reveal";
import { Icon } from "../components/Icon";
import { BtnLink, Card, Em, KpiStat, SectionHead } from "../components/ui";
import { cn } from "../lib/cn";

/* ------------------------------------------------------------------ */
/* Page data                                                           */
/* ------------------------------------------------------------------ */

const NAV: NavLink[] = [
  { label: "Discover", href: "#discover" },
  { label: "Experiences", href: "#experiences" },
  { label: "Itineraries", href: "#itinerary" },
  { label: "Districts", href: "#districts" },
  { label: "Plan", href: "#plan" },
  { label: "Data Platform", href: "/" },
];

const STATS: { value: string; unit?: string; label: string }[] = [
  { value: "2,000", unit: "+", label: "Years of heritage" },
  { value: "9", label: "Theme districts" },
  { value: "217", unit: " km²", label: "Riverfront capital" },
  { value: "365", label: "Days of sunshine" },
];

type Discover = { tag: string; title: string; desc: string; c: string };
const DISCOVER: Discover[] = [
  {
    tag: "Heritage",
    title: "The Great Stupa",
    desc: "The 2,000-year-old Amaravati Mahachaitya — cradle of a celebrated Buddhist art school.",
    c: "#caa23f",
  },
  {
    tag: "Riverfront",
    title: "The Krishna's edge",
    desc: "Sunset promenades, bund roads and boat points along the northern riverfront.",
    c: "#129aa7",
  },
  {
    tag: "The Capital",
    title: "Government spine",
    desc: "Walk the legislative & administrative spine of a capital being born.",
    c: "#2f6bf0",
  },
  {
    tag: "Culture",
    title: "Art & craft",
    desc: "Kalamkari, handloom and the living crafts of the Krishna delta.",
    c: "#ff7a45",
  },
  {
    tag: "Cuisine",
    title: "Andhra flavours",
    desc: "Fiery curries, riverfish and the legendary Andhra thali.",
    c: "#e0556a",
  },
  {
    tag: "Future",
    title: "Quantum Valley",
    desc: "Tour the deep-tech district reimagining the city of tomorrow.",
    c: "#1c9a5e",
  },
];

type ExpCat = "heritage" | "river" | "culture" | "nature" | "family";
type Experience = {
  cat: ExpCat;
  title: string;
  desc: string;
  duration: string;
  level: string;
};
const EXPERIENCES: Experience[] = [
  {
    cat: "heritage",
    title: "Mahachaitya heritage walk",
    desc: "A guided morning at the Great Stupa and its sculpture galleries.",
    duration: "3 hrs",
    level: "Easy",
  },
  {
    cat: "heritage",
    title: "Dhyana Buddha viewpoint",
    desc: "A serene riverside vantage and meditation lawn at dawn.",
    duration: "2 hrs",
    level: "Easy",
  },
  {
    cat: "river",
    title: "Sunset river cruise",
    desc: "Golden-hour boat ride along the Krishna's capital reach.",
    duration: "90 min",
    level: "Easy",
  },
  {
    cat: "river",
    title: "Bund-road cycle trail",
    desc: "Ride the riverfront promenade past parks and ghats.",
    duration: "2 hrs",
    level: "Active",
  },
  {
    cat: "culture",
    title: "Kalamkari craft studio",
    desc: "Hands-on natural-dye block printing with local artisans.",
    duration: "2.5 hrs",
    level: "Easy",
  },
  {
    cat: "culture",
    title: "Capital festival evening",
    desc: "Music, lamps and dance on the riverfront during Sankranti season.",
    duration: "Evening",
    level: "Easy",
  },
  {
    cat: "nature",
    title: "Blue-green network trail",
    desc: "Walk the parks and wetlands of the planned green spine.",
    duration: "2 hrs",
    level: "Easy",
  },
  {
    cat: "nature",
    title: "Riverside birding",
    desc: "Early-morning birdwatch along the Krishna backwaters.",
    duration: "3 hrs",
    level: "Easy",
  },
  {
    cat: "family",
    title: "Sports City day out",
    desc: "Stadia, lawns and family activities in the sports district.",
    duration: "Half day",
    level: "Family",
  },
  {
    cat: "family",
    title: "Riverfront food walk",
    desc: "A relaxed tasting trail of Andhra street food and sweets.",
    duration: "2 hrs",
    level: "Family",
  },
];

const EXP_FILTERS: { key: "all" | ExpCat; label: string }[] = [
  { key: "all", label: "All" },
  { key: "heritage", label: "Heritage" },
  { key: "river", label: "Riverfront" },
  { key: "culture", label: "Culture" },
  { key: "nature", label: "Nature" },
  { key: "family", label: "Family" },
];

type TimelineItem = { time: string; title: string; desc: string };
const ITINERARIES: { key: string; label: string; items: TimelineItem[] }[] = [
  {
    key: "1",
    label: "1 day",
    items: [
      { time: "07:30", title: "Sunrise at Dhyana Buddha", desc: "Begin with stillness and a river view as the city wakes." },
      { time: "09:30", title: "The Great Stupa", desc: "Guided heritage walk through the Mahachaitya galleries." },
      { time: "13:00", title: "Andhra thali lunch", desc: "A fiery, unforgettable riverside meal." },
      { time: "16:30", title: "Sunset cruise", desc: "Glide the Krishna as the capital glows gold." },
    ],
  },
  {
    key: "2",
    label: "2 days",
    items: [
      { time: "Day 1", title: "Heritage & river", desc: "Stupa, Dhyana Buddha and a sunset cruise." },
      { time: "Day 2 · AM", title: "Craft & culture", desc: "Kalamkari studio and the handloom bazaar." },
      { time: "Day 2 · PM", title: "Capital walk", desc: "The government spine and the green network." },
      { time: "Evening", title: "Festival riverfront", desc: "Lamps, music and street food." },
    ],
  },
  {
    key: "3",
    label: "3 days",
    items: [
      { time: "Day 1", title: "Heritage core", desc: "The Great Stupa and Buddhist art trail." },
      { time: "Day 2", title: "River & nature", desc: "Cruise, cycle trail and the blue-green network." },
      { time: "Day 3 · AM", title: "Culture & cuisine", desc: "Crafts, markets and a food walk." },
      { time: "Day 3 · PM", title: "Future district", desc: "Quantum Valley deep-tech tour." },
    ],
  },
];

type District = { name: string; descriptor: string; c: string };
const DISTRICTS: District[] = [
  { name: "Government City", descriptor: "The legislative spine", c: "#ff9933" },
  { name: "Justice City", descriptor: "High Court precinct", c: "#e7c46b" },
  { name: "Finance City", descriptor: "Markets & capital", c: "#1c9a5e" },
  { name: "Knowledge City", descriptor: "Universities", c: "#2f6bf0" },
  { name: "Health City", descriptor: "Wellness & care", c: "#e0556a" },
  { name: "Sports City", descriptor: "Stadia & lawns", c: "#16a0b0" },
  { name: "Media City", descriptor: "Film & creative", c: "#b06ad8" },
  { name: "Tourism City", descriptor: "Riverfront & leisure", c: "#ff7a45" },
  { name: "Quantum Valley", descriptor: "Deep-tech frontier", c: "#7ad0ff" },
];

type Interest = "Heritage" | "Riverfront" | "Culture" | "Cuisine" | "Nature" | "Family";
const INTERESTS: { key: Interest; icon: string }[] = [
  { key: "Heritage", icon: "building" },
  { key: "Riverfront", icon: "map" },
  { key: "Culture", icon: "spark" },
  { key: "Cuisine", icon: "bolt" },
  { key: "Nature", icon: "layers" },
  { key: "Family", icon: "users" },
];
const INTEREST_PHRASE: Record<Interest, string> = {
  Heritage: "the Great Stupa and the Dhyana Buddha viewpoint",
  Riverfront: "a bund-road cycle and a sunset cruise",
  Culture: "a Kalamkari studio and the handloom bazaar",
  Cuisine: "an Andhra thali and a riverfront food walk",
  Nature: "the blue-green network trail and riverside birding",
  Family: "Sports City and a relaxed food walk",
};

const GALLERY: { caption: string; from: string; to: string }[] = [
  { caption: "Golden riverfront", from: "#ff9933", to: "#e7c46b" },
  { caption: "The Great Stupa", from: "#caa23f", to: "#8a6d24" },
  { caption: "Capital spine", from: "#2f6bf0", to: "#0a1f44" },
  { caption: "Festival lamps", from: "#ff7a45", to: "#e0556a" },
  { caption: "Green network", from: "#1c9a5e", to: "#138808" },
  { caption: "Kalamkari craft", from: "#b06ad8", to: "#e0556a" },
  { caption: "Sunrise over Krishna", from: "#ff9933", to: "#129aa7" },
  { caption: "Quantum Valley", from: "#7ad0ff", to: "#2f6bf0" },
];

const PLAN_CARDS: { icon: string; title: string; desc: string }[] = [
  { icon: "arrow", title: "Getting there", desc: "Nearest airport and rail at Vijayawada, ~35–40 km; well-linked by road." },
  { icon: "spark", title: "Best time", desc: "October to March — cool, clear and festival-rich. Sankranti in January is special." },
  { icon: "building", title: "Where to stay", desc: "From riverfront concept resorts to city-edge business hotels in nearby Vijayawada." },
  { icon: "map", title: "Getting around", desc: "Walkable riverfront, cycle trails and app cabs across the capital region." },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Amaravati open to visitors today?",
    a: "Amaravati is a capital under development. The Amaravati Mahachaitya (Great Stupa), museum and riverfront areas are publicly documented heritage destinations; this guide is an indicative concept experience.",
  },
  {
    q: "How many days do I need?",
    a: "One day covers the heritage core and a sunset cruise. Two to three days let you add culture, cuisine, nature and the future district.",
  },
  {
    q: "Is it family-friendly?",
    a: "Yes — riverfront walks, parks, sports lawns and food trails suit all ages.",
  },
  {
    q: "What about the heritage I'll see?",
    a: "The Amaravati school of Buddhist art is world-renowned, with roots over two millennia old. Expect sculpture, stupa architecture and serene river views.",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Highlights", href: "#discover" },
      { label: "Experiences", href: "#experiences" },
      { label: "Districts", href: "#districts" },
      { label: "Gallery", href: "#gallery" },
    ],
  },
  {
    title: "Plan",
    links: [
      { label: "Itineraries", href: "#itinerary" },
      { label: "Trip designer", href: "#build" },
      { label: "Getting there", href: "#plan" },
      { label: "Best time", href: "#plan" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Data Platform", href: "/" },
      { label: "Command Center", href: "/command-center" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function joinPhrases(phrases: string[]): string {
  if (phrases.length === 0) return "";
  if (phrases.length === 1) return phrases[0];
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Visit() {
  const [expFilter, setExpFilter] = useState<"all" | ExpCat>("all");
  const [dayKey, setDayKey] = useState("1");
  const [selectedDistrict, setSelectedDistrict] = useState(0);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredExp = useMemo(
    () => (expFilter === "all" ? EXPERIENCES : EXPERIENCES.filter((e) => e.cat === expFilter)),
    [expFilter],
  );
  const activeDay = ITINERARIES.find((d) => d.key === dayKey) ?? ITINERARIES[0];

  function toggleInterest(k: Interest) {
    setInterests((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  }

  const planLabel = interests.length <= 2 ? "Your perfect day" : "Your packed day";
  const planBody =
    interests.length === 0
      ? null
      : `Start at the riverfront, then weave in ${joinPhrases(
          interests.map((i) => INTEREST_PHRASE[i]),
        )}. End with sunset over the Krishna.`;

  return (
    <div className="bg-paper">
      <SiteHeader
        links={NAV}
        cta={{ label: "Plan your visit", to: "#plan" }}
        brandSubtitle="Visit · Concept Guide"
      />

      <main id="main">
        {/* ----------------------------------------------------------- HERO */}
        <section className="relative scroll-mt-24 pt-32">
          <div className="wrap">
            <Reveal className="max-w-content">
              <span className="eyebrow mb-4 inline-flex items-center gap-2">
                <Icon name="spark" className="h-4 w-4 text-saffron" />
                The Sunrise State · Andhra Pradesh
              </span>
              <h1 className="text-balance text-[clamp(2.4rem,6vw,4.4rem)] font-medium leading-[1.02] tracking-tight">
                Where a capital meets the Krishna.
              </h1>
              <p className="mt-6 max-w-prose2 text-lg text-ink-muted">
                Two thousand years of Buddhist heritage, a living riverfront and nine theme
                districts rising as the People's Capital. Discover Amaravati.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <BtnLink to="#plan" variant="primary">
                  Plan your visit →
                </BtnLink>
                <BtnLink to="#discover" variant="ghost">
                  Discover the city
                </BtnLink>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------------------------------------- STATS */}
        <section className="wrap mt-16 sm:mt-20">
          <Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft shadow-card lg:grid-cols-4">
              {STATS.map((s) => (
                <KpiStat key={s.label} value={s.value} unit={s.unit} label={s.label} />
              ))}
            </div>
          </Reveal>
        </section>

        {/* ----------------------------------------------------------- DISCOVER */}
        <section id="discover" className="wrap scroll-mt-24 py-20 sm:py-28">
          <Reveal>
            <SectionHead
              kicker="Discover"
              title={
                <>
                  Six reasons to <Em>fall for Amaravati.</Em>
                </>
              }
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DISCOVER.map((d, i) => (
              <Reveal key={d.title} delay={i * 60}>
                <Card className="flex h-full flex-col overflow-hidden p-0">
                  <div
                    className="h-2 w-full"
                    style={{ background: `linear-gradient(90deg, ${d.c}, ${d.c}66)` }}
                    aria-hidden
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      className="mb-3 inline-flex w-fit items-center gap-1.5 text-2xs font-semibold uppercase tracking-wide"
                      style={{ color: d.c }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: d.c }}
                        aria-hidden
                      />
                      {d.tag}
                    </span>
                    <h3 className="font-serif text-xl text-ink">{d.title}</h3>
                    <p className="mt-2 text-sm text-ink-muted">{d.desc}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------------- EXPERIENCES */}
        <section id="experiences" className="scroll-mt-24 border-y border-line-soft bg-paper-2 py-20 sm:py-28">
          <div className="wrap">
            <Reveal>
              <SectionHead
                kicker="Experiences"
                title={
                  <>
                    Curated things <Em>to do.</Em>
                  </>
                }
                intro="Filter by what moves you — heritage, riverfront, culture, nature or family. Every experience is an indicative concept itinerary."
              />
            </Reveal>

            <Reveal>
              <div role="tablist" aria-label="Filter experiences" className="mb-8 flex flex-wrap gap-2">
                {EXP_FILTERS.map((f) => {
                  const active = expFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setExpFilter(f.key)}
                      className={cn(
                        "min-h-[44px] cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-paper text-ink-muted hover:border-brand hover:text-brand",
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExp.map((e, i) => (
                <Reveal key={e.title} delay={i * 40}>
                  <Card as="article" className="flex h-full flex-col">
                    <h3 className="font-serif text-lg text-ink">{e.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-muted">{e.desc}</p>
                    <div className="mt-4 flex items-center gap-3 text-2xs uppercase tracking-wide text-ink-faint">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="map" className="h-3.5 w-3.5" />
                        Amaravati
                      </span>
                      <span className="text-line">·</span>
                      <span>{e.duration}</span>
                      <span className="text-line">·</span>
                      <span>{e.level}</span>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- ITINERARIES */}
        <section id="itinerary" className="wrap scroll-mt-24 py-20 sm:py-28">
          <Reveal>
            <SectionHead
              kicker="Itineraries"
              title={
                <>
                  How long do you <Em>have?</Em>
                </>
              }
              intro="Pick a pace and we'll map the day. Hand-built concept routes across heritage, river and culture."
            />
          </Reveal>

          <Reveal>
            <div role="tablist" aria-label="Trip length" className="mb-8 flex flex-wrap gap-2">
              {ITINERARIES.map((d) => {
                const active = d.key === dayKey;
                return (
                  <button
                    key={d.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setDayKey(d.key)}
                    className={cn(
                      "min-h-[44px] cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-paper text-ink-muted hover:border-brand hover:text-brand",
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal>
            <ol className="relative max-w-prose2 border-l border-line pl-8">
              {activeDay.items.map((it) => (
                <li key={it.time + it.title} className="relative mb-8 last:mb-0">
                  <span
                    className="absolute -left-[2.45rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand bg-paper"
                    aria-hidden
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  </span>
                  <div className="font-mono text-2xs uppercase tracking-[0.16em] text-brand">
                    {it.time}
                  </div>
                  <h3 className="mt-1 font-serif text-lg text-ink">{it.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{it.desc}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        {/* ----------------------------------------------------------- DISTRICTS */}
        <section id="districts" className="scroll-mt-24 border-y border-line-soft bg-paper-2 py-20 sm:py-28">
          <div className="wrap">
            <Reveal>
              <SectionHead
                kicker="The polycentric capital"
                title={
                  <>
                    Nine districts, <Em>one riverfront.</Em>
                  </>
                }
                intro="Amaravati rises as nine theme districts along the Krishna and the Inner Ring Road. Tap a zone to explore."
              />
            </Reveal>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <Reveal>
                <div
                  role="group"
                  aria-label="District selector"
                  className="grid grid-cols-3 gap-3"
                >
                  {DISTRICTS.map((d, i) => {
                    const active = selectedDistrict === i;
                    return (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => setSelectedDistrict(i)}
                        aria-pressed={active}
                        className={cn(
                          "min-h-[88px] cursor-pointer rounded-card border p-3 text-left transition-all",
                          active
                            ? "border-transparent shadow-lift"
                            : "border-line-soft bg-paper hover:border-line",
                        )}
                        style={
                          active
                            ? { background: `${d.c}1a`, borderColor: d.c }
                            : undefined
                        }
                      >
                        <span
                          className="mb-2 block h-2.5 w-2.5 rounded-full"
                          style={{ background: d.c }}
                          aria-hidden
                        />
                        <span className="block font-serif text-sm leading-tight text-ink">
                          {d.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal delay={80}>
                <Card className="flex flex-col gap-5">
                  <div>
                    <span
                      className="inline-flex items-center gap-2 text-2xs font-semibold uppercase tracking-wide"
                      style={{ color: DISTRICTS[selectedDistrict].c }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: DISTRICTS[selectedDistrict].c }}
                        aria-hidden
                      />
                      District {selectedDistrict + 1} of 9
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-ink">
                      {DISTRICTS[selectedDistrict].name}
                    </h3>
                    <p className="mt-1 text-ink-muted">{DISTRICTS[selectedDistrict].descriptor}</p>
                  </div>

                  {/* simple CSS map */}
                  <div
                    className="relative aspect-[4/3] overflow-hidden rounded-card border border-line-soft bg-paper"
                    aria-hidden
                  >
                    {/* river */}
                    <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-brand/15 to-transparent" />
                    <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
                      <path
                        d="M0 70 C 90 50, 150 95, 240 70 S 360 50, 400 80"
                        fill="none"
                        stroke="rgb(var(--brand))"
                        strokeWidth="6"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      <line
                        x1="60"
                        y1="120"
                        x2="340"
                        y2="240"
                        stroke="rgb(var(--ink))"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                        opacity="0.4"
                      />
                    </svg>
                    <span className="absolute left-3 top-2 font-mono text-2xs uppercase tracking-[0.16em] text-brand">
                      Krishna riverfront
                    </span>
                    <span className="absolute bottom-2 right-3 max-w-[60%] text-right font-mono text-2xs uppercase tracking-[0.16em] text-ink-faint">
                      Capital spine · Inner Ring Road
                    </span>
                    <span
                      className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-paper"
                      style={{ background: DISTRICTS[selectedDistrict].c }}
                    />
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- BUILD YOUR TRIP */}
        <section id="build" className="wrap scroll-mt-24 py-20 sm:py-28">
          <Reveal>
            <SectionHead
              kicker="Trip designer"
              title="Build your perfect day."
              intro="Tell us what you love — we'll suggest a route."
            />
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <div
                role="group"
                aria-label="Select your interests"
                className="flex flex-wrap gap-2.5"
              >
                {INTERESTS.map((it) => {
                  const active = interests.includes(it.key);
                  return (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => toggleInterest(it.key)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-paper text-ink-muted hover:border-brand hover:text-brand",
                      )}
                    >
                      <Icon name={it.icon} className="h-4 w-4" />
                      {it.key}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <Card aria-live="polite" className="min-h-[180px]">
                {planBody === null ? (
                  <>
                    <h4 className="font-serif text-lg text-ink">Pick an interest above</h4>
                    <p className="mt-2 text-sm text-ink-muted">
                      Choose one or more themes and we'll shape a day around the riverfront and the
                      heritage core.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-2xs font-semibold uppercase tracking-wide text-brand">
                      {planLabel}
                    </span>
                    <h4 className="mt-2 font-serif text-xl text-ink">
                      A day shaped around {interests.length}{" "}
                      {interests.length === 1 ? "love" : "loves"}
                    </h4>
                    <p className="mt-3 text-ink-muted">{planBody}</p>
                  </>
                )}
              </Card>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------------------------------------- GALLERY */}
        <section id="gallery" className="scroll-mt-24 border-y border-line-soft bg-paper-2 py-20 sm:py-28">
          <div className="wrap">
            <Reveal>
              <SectionHead
                kicker="Gallery"
                title={
                  <>
                    A capital, <Em>in colour.</Em>
                  </>
                }
                intro="Original, illustrative impressions — not photographs."
              />
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {GALLERY.map((g, i) => (
                <Reveal key={g.caption} delay={i * 40}>
                  <figure className="group relative overflow-hidden rounded-card border border-line-soft shadow-card">
                    <div
                      className={cn(
                        "w-full",
                        i % 3 === 0 ? "aspect-[3/4]" : "aspect-square",
                      )}
                      style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                      aria-hidden
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 text-xs font-medium text-white">
                      {g.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- PLAN */}
        <section id="plan" className="wrap scroll-mt-24 py-20 sm:py-28">
          <Reveal>
            <SectionHead
              kicker="Plan your visit"
              title={
                <>
                  Everything you need <Em>to go.</Em>
                </>
              }
            />
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {PLAN_CARDS.map((p, i) => (
              <Reveal key={p.title} delay={i * 50}>
                <Card className="flex h-full gap-4">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line-soft bg-paper text-brand">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-ink">{p.title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{p.desc}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* FAQ */}
          <Reveal className="mt-10">
            <div className="max-w-prose2 divide-y divide-line-soft overflow-hidden rounded-card border border-line-soft bg-paper-2">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                      className="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-serif text-base text-ink">{f.q}</span>
                      <span
                        className="flex-none text-xl leading-none text-brand"
                        aria-hidden
                      >
                        {open ? "×" : "+"}
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-gov",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm text-ink-muted">{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        {/* ----------------------------------------------------------- CTA BAND */}
        <section className="border-t border-line-soft bg-navy text-white">
          <div className="wrap py-20 sm:py-24">
            <Reveal className="max-w-content">
              <h2 className="text-balance text-[clamp(1.8rem,4vw,2.8rem)] font-medium leading-[1.06]">
                Your Amaravati story starts here.
              </h2>
              <p className="mt-4 max-w-prose2 text-white/75">
                Save your trip, get the concept guide, and follow the People's Capital as it rises.
              </p>
              <div className="mt-7">
                <BtnLink to="#plan" variant="primary">
                  Start planning →
                </BtnLink>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter
        blurb="The concept destination guide to Amaravati, the People's Capital on the Krishna."
        columns={FOOTER_COLUMNS}
      />
      <Disclaimer variant="visit" />
    </div>
  );
}
