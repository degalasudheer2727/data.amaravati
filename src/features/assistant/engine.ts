import { CLASS_TIERS } from "../../lib/classification";
import { DATASETS } from "../../data/platform";

/**
 * data.amaravati assistant — a concept, on-device reply engine grounded in the
 * platform's real catalogue, classification model and headline figures.
 * No external LLM: intent-matched, governed answers. Consent-bound & audit-logged.
 */
export interface ChatAction {
  label: string;
  to: string;
}
export interface Reply {
  text: string;
  actions?: ChatAction[];
}

export const SUGGESTIONS = [
  "What is data.amaravati?",
  "Explain the data classification tiers",
  "How do I request a dataset?",
  "What's the current air quality?",
  "How does the CRDA exchange work?",
  "Show me the leadership cockpit",
];

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

export function getReply(input: string): Reply {
  const q = input.toLowerCase().trim();

  if (!q) return { text: "Ask me anything about the governed data platform." };

  if (has(q, "hello", "hi ", "hey", "namaste") || q === "hi")
    return {
      text: "Namaste — I'm the data.amaravati assistant. I can explain the governed catalogue, the four confidentiality tiers, how to request data, the CRDA exchange, and the city's live figures. What would you like to know?",
    };

  if (has(q, "thank"))
    return { text: "You're welcome. Every request here is consent-bound and audit-logged." };

  if (has(q, "who are you", "what can you", "help", "what is data.amaravati", "about", "what is this"))
    return {
      text: "data.amaravati is the governed data platform and living digital twin of Amaravati — the People's Capital. It serves open, internal, sensitive and confidential city data by your authority, under consent and audit, and runs a CRDA-governed exchange between government entities.",
      actions: [
        { label: "Explore the platform", to: "/" },
        { label: "Visit Amaravati", to: "/visit" },
      ],
    };

  if (has(q, "classif", "tier", "confidential", "sensitive", "internal tier", "open data tier", "levels"))
    return {
      text:
        "Every dataset carries one of four confidentiality tiers, and your authority — not your team — decides what you reach:\n" +
        CLASS_TIERS.map((c) => `• ${c.title} (${c.level}) — ${c.desc}`).join("\n"),
      actions: [{ label: "See the access model", to: "/#access" }],
    };

  if (has(q, "request", "access", "download", "how do i get", "api key", "get data"))
    return {
      text: "Sign in and pick a persona — it sets a default access envelope across the four tiers. Open data is instant; internal & sensitive tiers route through a purpose review and a data-sharing agreement; confidential records need clearance and DPO approval. Every request is logged.",
      actions: [
        { label: "Sign in", to: "/login" },
        { label: "Browse the catalogue", to: "/#catalogue" },
      ],
    };

  if (has(q, "exchange", "share data", "inter-agency", "crda", "g2g", "between agencies"))
    return {
      text: "The Data Exchange Hub lets one government entity request data from another. The hub classifies it, CRDA verifies purpose, legal basis and DPDP/consent, and on approval a time-boxed, consent-bound agreement is registered. Every transaction is audited and can be revoked.",
      actions: [{ label: "Open the Exchange Hub", to: "/#exchange" }],
    };

  if (has(q, "kpi", "cockpit", "leadership", "performance", "score", "decision"))
    return {
      text: "The Decision Cockpit gives leadership a city-wide view — an all-entity weekly KPI leaderboard, the composite city score, and the policy signals that need a decision this week. It's restricted to the Leadership · CRDA persona.",
      actions: [
        { label: "Open the Decision Cockpit", to: "/#cockpit" },
        { label: "Sign in as leadership", to: "/login" },
      ],
    };

  if (has(q, "air", "aqi", "pollution", "quality"))
    return {
      text: "Capital-city air quality is 71 (Good). The Air Quality Index (CAAQMS) is an open dataset from APPCB, served as a REST API and refreshed hourly — no sign-in needed.",
      actions: [{ label: "Open the catalogue", to: "/#catalogue" }],
    };

  if (has(q, "river", "krishna", "water", "flood", "bund"))
    return {
      text: "The Krishna riverfront level is 12.4 m (stable). Riverfront & bund levels are open (REST API, 10-min cadence, owned by Irrigation); reservoir & supply SCADA telemetry is sensitive and needs an agreement.",
      actions: [{ label: "Open the catalogue", to: "/#catalogue" }],
    };

  if (has(q, "traffic", "road", "mobility", "transit", "bus", "metro"))
    return {
      text: "Inner Ring Road traffic flow and live transit positions (GTFS-RT, 15-second cadence) are open. ANPR number-plate movements are sensitive and need a data-sharing agreement.",
      actions: [{ label: "Open the catalogue", to: "/#catalogue" }],
    };

  if (has(q, "land", "zoning", "parcel", "plot", "pooling", "lps"))
    return {
      text: "Land-use zoning parcels (R·C·I·P·S·U) are open as GeoJSON from APCRDA Planning. Layout & plot sanctions are internal; land-pooling returns are sensitive; individual land-loser records are confidential.",
      actions: [{ label: "See the access model", to: "/#access" }],
    };

  if (has(q, "visit", "tourism", "travel", "stupa", "heritage", "things to do"))
    return {
      text: "For the destination guide — heritage, the Great Stupa, the riverfront, nine theme districts and itineraries — head to Visit Amaravati.",
      actions: [{ label: "Visit Amaravati", to: "/visit" }],
    };

  if (has(q, "command", "twin", "console", "map", "layers", "signals"))
    return {
      text: "The Command Center is the mission-control console — live data layers, the digital-twin map, KPIs and a live signals feed for the governed platform.",
      actions: [{ label: "Open the Command Center", to: "/command-center" }],
    };

  if (has(q, "how many dataset", "how much data", "catalogue size", "datasets"))
    return {
      text: `The catalogue holds 1,200+ governed datasets across all tiers — ${DATASETS.length} illustrative samples are shown here, spanning land, mobility, water, environment, economy, housing, safety and more.`,
      actions: [{ label: "Browse the catalogue", to: "/#catalogue" }],
    };

  // fallback
  return {
    text: "I can help with the governed catalogue, the four confidentiality tiers, how to request data, the CRDA exchange, the leadership cockpit, and live city figures like air quality or the riverfront level. Try one of the suggestions, or ask in your own words.",
    actions: [
      { label: "Browse the catalogue", to: "/#catalogue" },
      { label: "See the access model", to: "/#access" },
    ],
  };
}
