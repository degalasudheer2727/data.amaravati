import type { ClassKey } from "../lib/classification";

/* ---------- headline KPIs ---------- */
export const KPIS = [
  { value: "217", unit: " km²", label: "Amaravati capital city" },
  { value: "1,575", unit: " ac", label: "Government Complex · AGC" },
  { value: "21", unit: "", label: "Land-use zones · R·C·I·P·S·U" },
  { value: "1.2", unit: "k+", label: "Governed datasets · all tiers" },
];

/* ---------- five pillars of digital transformation ---------- */
export interface Pillar {
  n: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  icon: string;
}
export const PILLARS: Pillar[] = [
  {
    n: "01",
    title: "Digital Infrastructure",
    desc: "A navigable 3D digital twin on secure, scalable cloud foundations — the live spatial backbone of the capital.",
    href: "/command-center",
    cta: "Explore the twin",
    icon: "layers",
  },
  {
    n: "02",
    title: "Data & Interoperability",
    desc: "One governed catalogue of open, internal, sensitive and confidential datasets — each with a schema, owner, licence and open API.",
    href: "#catalogue",
    cta: "Open the catalogue",
    icon: "database",
  },
  {
    n: "03",
    title: "Citizen-Centric Services",
    desc: "Insight and services delivered to the right authority — personas, consent and one sign-on across every entity.",
    href: "#access",
    cta: "See the access model",
    icon: "users",
  },
  {
    n: "04",
    title: "Trust, Security & Governance",
    desc: "Classification, consent, encryption and audit — every government-to-government exchange governed by CRDA.",
    href: "#exchange",
    cta: "Governed exchange",
    icon: "shield",
  },
  {
    n: "05",
    title: "Innovation & Analytics",
    desc: "A decision cockpit for leadership — city-wide insights, all-entity KPI oversight and the signals that shape policy.",
    href: "#cockpit",
    cta: "Decision Cockpit",
    icon: "gauge",
  },
];

/* ---------- personas + access envelope (y=instant, c=on agreement, n=closed) ---------- */
export type Access = "y" | "c" | "n";
export interface Persona {
  key: string;
  title: string;
  desc: string;
  access: Record<ClassKey, Access>;
}
export const PERSONAS: Persona[] = [
  {
    key: "citizen",
    title: "Citizen",
    desc: "Residents exploring their ward — services, air, water and build progress.",
    access: { open: "y", internal: "n", sensitive: "n", confidential: "n" },
  },
  {
    key: "researcher",
    title: "Researcher · Academia",
    desc: "Universities & analysts working on aggregate, de-identified data.",
    access: { open: "y", internal: "c", sensitive: "c", confidential: "n" },
  },
  {
    key: "startup",
    title: "Startup · Enterprise",
    desc: "Builders shipping products on governed commercial feeds and APIs.",
    access: { open: "y", internal: "y", sensitive: "n", confidential: "n" },
  },
  {
    key: "agency",
    title: "Government Agency",
    desc: "Departments exchanging operational data under governed agreements.",
    access: { open: "y", internal: "y", sensitive: "y", confidential: "c" },
  },
  {
    key: "partner",
    title: "Infrastructure Partner",
    desc: "Utilities & concessionaires operating city systems at scale.",
    access: { open: "y", internal: "y", sensitive: "y", confidential: "n" },
  },
  {
    key: "steward",
    title: "Data Steward",
    desc: "Custodians who publish, classify and govern the catalogue.",
    access: { open: "y", internal: "y", sensitive: "y", confidential: "y" },
  },
  {
    key: "leadership",
    title: "Leadership · CRDA",
    desc: "Decision-makers and CRDA leadership — city-wide insight, entity oversight and policy signals.",
    access: { open: "y", internal: "y", sensitive: "y", confidential: "c" },
  },
];
export const PERSONA_BY_KEY = Object.fromEntries(PERSONAS.map((p) => [p.key, p]));

/* ---------- sample dataset catalogue (illustrative, grounded in the public plan) ---------- */
export interface Dataset {
  ent: string;
  cls: ClassKey;
  title: string;
  desc: string;
  fmt: string;
  cad: string;
  owner: string;
}
export const DATASETS: Dataset[] = [
  { ent: "Land & Zoning", cls: "open", title: "Land-Use Zoning Parcels", desc: "Every parcel by zone family — R·C·I·P·S·U — from the Detailed Master Plan.", fmt: "GeoJSON", cad: "On revision", owner: "APCRDA Planning" },
  { ent: "Land & Zoning", cls: "internal", title: "Layout & Plot Sanctions", desc: "Approved layouts, sub-division and plot-level sanction status.", fmt: "REST API", cad: "Daily", owner: "DTCP · APCRDA" },
  { ent: "Land & Zoning", cls: "sensitive", title: "Land-Pooling (LPS) Returns", desc: "Returnable-plot allotments against pooled survey numbers across 29 villages.", fmt: "API", cad: "Weekly", owner: "APCRDA" },
  { ent: "Governance", cls: "open", title: "Citizen Grievances (PGRS)", desc: "Service requests and resolution times across the capital city.", fmt: "CSV · API", cad: "Daily", owner: "Citizen Services" },
  { ent: "Governance", cls: "internal", title: "Building Permits & Occupancy", desc: "Permit pipeline, approvals and occupancy certificates.", fmt: "REST API", cad: "Hourly", owner: "APCRDA Planning" },
  { ent: "Governance", cls: "confidential", title: "Official Action & Approval Logs", desc: "Identifiable officer decision and file-movement audit trail.", fmt: "—", cad: "—", owner: "APCRDA" },
  { ent: "Mobility", cls: "open", title: "Inner Ring Road Traffic Flow", desc: "Speed and volume across the IRR and arterial 60/50/25 m network.", fmt: "GeoJSON", cad: "5 min", owner: "Transport Dept" },
  { ent: "Mobility", cls: "open", title: "Public Transit Positions", desc: "Live bus/metro vehicle positions for the capital region.", fmt: "GTFS-RT", cad: "15 sec", owner: "APSRTC" },
  { ent: "Mobility", cls: "sensitive", title: "ANPR Vehicle Movements", desc: "Number-plate transit records at key junctions.", fmt: "API", cad: "Real-time", owner: "Traffic Police" },
  { ent: "Water", cls: "open", title: "Krishna Riverfront & Bund Levels", desc: "River stage and bund-road levels along the northern edge.", fmt: "REST API", cad: "10 min", owner: "Irrigation" },
  { ent: "Water", cls: "sensitive", title: "Reservoir & Supply (SCADA)", desc: "Pump-house pressure, storage and distribution telemetry.", fmt: "—", cad: "Real-time", owner: "Water Utility" },
  { ent: "Environment", cls: "open", title: "Air Quality Index (CAAQMS)", desc: "Continuous ambient air-quality monitoring across stations.", fmt: "REST API", cad: "Hourly", owner: "APPCB" },
  { ent: "Environment", cls: "open", title: "Green & Blue Network Cover", desc: "Canopy, parks (P1/P2/P3) and the blue-green water network.", fmt: "GeoTIFF", cad: "Seasonal", owner: "APCRDA" },
  { ent: "Economy", cls: "open", title: "Sectoral GVA, Jobs & Output", desc: "Headline economic indicators by sector for the capital.", fmt: "CSV", cad: "Quarterly", owner: "Economic Dev" },
  { ent: "Economy", cls: "internal", title: "FDI & Investment Pipeline", desc: "Committed and in-pipeline investment by zone and sector.", fmt: "API", cad: "Weekly", owner: "AP EDB" },
  { ent: "Housing", cls: "internal", title: "Affordable Housing Allotments", desc: "Stock, allotment and occupancy of public housing.", fmt: "CSV", cad: "Weekly", owner: "APCRDA" },
  { ent: "Housing", cls: "sensitive", title: "Property Registration Prices", desc: "Plot-level registered transaction values.", fmt: "—", cad: "Daily", owner: "Registration & Stamps" },
  { ent: "Demographics", cls: "open", title: "Ward Population & Density", desc: "Population, households and density by ward and zone.", fmt: "CSV", cad: "Annual", owner: "DES" },
  { ent: "Demographics", cls: "confidential", title: "Individual Land-Loser Records", desc: "Identifiable farmer/land-loser records under land pooling.", fmt: "—", cad: "—", owner: "APCRDA" },
  { ent: "Construction", cls: "open", title: "Government Complex (AGC) Progress", desc: "Works progress across the ~1,575-acre Government Complex.", fmt: "REST API", cad: "Daily", owner: "APCRDA" },
  { ent: "Safety", cls: "open", title: "Emergency Response (112) Times", desc: "Aggregate response times for police, fire and medical.", fmt: "API", cad: "Daily", owner: "Police · DM" },
  { ent: "Safety", cls: "confidential", title: "Command Centre Incident Feeds", desc: "Live CCTV-linked incident and surveillance feeds.", fmt: "—", cad: "—", owner: "Police" },
];

/* ---------- exchange hub: entities, workflow, register ---------- */
export interface Entity {
  abbr: string;
  name: string;
  role: string;
  pub: number;
  con: number;
  gov?: boolean;
}
export const ENTITIES: Entity[] = [
  { abbr: "APCRDA", name: "Capital Region Dev. Authority", role: "Governing authority", pub: 9, con: 5, gov: true },
  { abbr: "DTCP", name: "Town & Country Planning", role: "Provider · Consumer", pub: 3, con: 2 },
  { abbr: "Irrigation", name: "Water Resources Dept", role: "Provider", pub: 2, con: 1 },
  { abbr: "APSRTC", name: "Road Transport Corp.", role: "Provider · Consumer", pub: 2, con: 2 },
  { abbr: "APPCB", name: "Pollution Control Board", role: "Provider", pub: 2, con: 1 },
  { abbr: "AP Police", name: "Police & Command Centre", role: "Provider · Consumer", pub: 2, con: 3 },
  { abbr: "Reg. & Stamps", name: "Registration & Stamps", role: "Provider", pub: 1, con: 1 },
  { abbr: "AP EDB", name: "Economic Development Board", role: "Consumer", pub: 1, con: 4 },
  { abbr: "DES", name: "Economics & Statistics", role: "Provider · Consumer", pub: 3, con: 3 },
  { abbr: "Transport", name: "Transport Department", role: "Provider · Consumer", pub: 2, con: 2 },
  { abbr: "Water Utility", name: "City Water Utility", role: "Provider", pub: 1, con: 2 },
  { abbr: "ULBs", name: "Urban Local Bodies", role: "Consumer", pub: 1, con: 5 },
];

export const EXFLOW = [
  { n: "01", title: "Request", desc: "A consumer entity requests a dataset from a provider through the hub." },
  { n: "02", title: "Classify & route", desc: "The hub tags the data's confidentiality tier and routes it by policy." },
  { n: "03", title: "CRDA review", desc: "CRDA verifies purpose, legal basis and DPDP / consent compliance.", gov: true },
  { n: "04", title: "Agreement", desc: "A signed, time-boxed, consent-bound data-sharing agreement is registered.", gov: true },
  { n: "05", title: "Provision", desc: "A secure API / exchange channel is opened between the two entities." },
  { n: "06", title: "Audit", desc: "Every transaction is logged; CRDA monitors and can revoke access.", gov: true },
];

export type ExStatus = "active" | "review" | "agreement" | "denied";
export const EX_STATUS: Record<ExStatus, { label: string; token: string }> = {
  active: { label: "Active", token: "text-open" },
  review: { label: "CRDA review", token: "text-internal" },
  agreement: { label: "Agreement", token: "text-sensitive" },
  denied: { label: "Declined", token: "text-confidential" },
};
export interface Exchange {
  prov: string;
  con: string;
  ds: string;
  cls: ClassKey;
  status: ExStatus;
  purpose: string;
}
export const EXCHANGES: Exchange[] = [
  { prov: "DTCP", con: "APCRDA", ds: "Layout & Plot Sanctions", cls: "internal", status: "active", purpose: "Master-plan compliance" },
  { prov: "Irrigation", con: "APCRDA", ds: "Krishna Riverfront Levels", cls: "open", status: "active", purpose: "Flood resilience" },
  { prov: "AP Police", con: "Transport", ds: "ANPR Vehicle Movements", cls: "sensitive", status: "review", purpose: "Corridor congestion modelling" },
  { prov: "Reg. & Stamps", con: "AP EDB", ds: "Property Registration Prices", cls: "sensitive", status: "agreement", purpose: "Land-value baselining" },
  { prov: "APPCB", con: "ULBs", ds: "Air Quality Index", cls: "open", status: "active", purpose: "Ward health dashboards" },
  { prov: "DES", con: "APCRDA", ds: "Ward Population & Density", cls: "open", status: "active", purpose: "Service planning" },
  { prov: "APCRDA", con: "AP Police", ds: "Individual Land-Loser Records", cls: "confidential", status: "denied", purpose: "Identity verification" },
  { prov: "Water Utility", con: "APCRDA", ds: "Reservoir & Supply (SCADA)", cls: "sensitive", status: "agreement", purpose: "Demand forecasting" },
  { prov: "APSRTC", con: "Transport", ds: "Public Transit Positions", cls: "open", status: "active", purpose: "Multimodal routing" },
];

/* ---------- live ticker ---------- */
export const TICKER = [
  "Krishna riverfront level · 12.4 m",
  "Government Complex works · 64% complete",
  "Inner Ring Road flow · free",
  "Capital-city AQI · 71 (Good)",
  "Solar generation today · 1.9 GWh",
  "Open datasets published · 1,240",
  "Transit ridership · +6.2% w/w",
  "Green canopy cover · 31%",
  "New building permits · 482",
];

/* ---------- theme cities ---------- */
export const CITIES = [
  { title: "Government City", desc: "The legislative & administrative spine.", c: "#ff9933" },
  { title: "Justice City", desc: "High Court & judicial precinct.", c: "#e7c46b" },
  { title: "Finance City", desc: "Banking, markets & capital.", c: "#138808" },
  { title: "Knowledge City", desc: "Universities & research.", c: "#3b7bff" },
  { title: "Health City", desc: "Hospitals & life sciences.", c: "#ff5f6d" },
  { title: "Sports City", desc: "Stadia & athletic venues.", c: "#34e0d8" },
  { title: "Media City", desc: "Film, broadcast & creative.", c: "#c98bff" },
  { title: "Tourism City", desc: "Riverfront, culture & leisure.", c: "#ffb347" },
  { title: "Electronics City", desc: "Manufacturing & deep-tech.", c: "#0a7d63" },
  { title: "Quantum Valley", desc: "Quantum compute & frontier R&D.", c: "#7ad0ff" },
];
