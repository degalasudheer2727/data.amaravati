/** The 4-tier confidentiality model — the spine of the whole platform. */
export type ClassKey = "open" | "internal" | "sensitive" | "confidential";

export interface ClassTier {
  key: ClassKey;
  level: string;
  title: string;
  desc: string;
  path: string;
  /** Tailwind text-colour token */
  token: string;
}

export const CLASS_TIERS: ClassTier[] = [
  {
    key: "open",
    level: "L0 · Open",
    title: "Open",
    desc: "Open data anyone can use, share and build on under an open licence.",
    path: "Instant download / open API · no sign-in needed",
    token: "open",
  },
  {
    key: "internal",
    level: "L1 · Internal",
    title: "Internal",
    desc: "Operational data shared across agencies and verified partners.",
    path: "Signed-in request, API key issued · access logged",
    token: "internal",
  },
  {
    key: "sensitive",
    level: "L2 · Sensitive",
    title: "Sensitive",
    desc: "Sensitive or commercially valuable data needing a data-sharing agreement.",
    path: "Agreement + purpose review · time-boxed, consent-bound",
    token: "sensitive",
  },
  {
    key: "confidential",
    level: "L3 · Confidential",
    title: "Confidential",
    desc: "Personal, security or identifying records — released only to cleared authority, need-to-know.",
    path: "Clearance + DPO approval · need-to-know, full audit",
    token: "confidential",
  },
];

export const CLASS_BY_KEY: Record<ClassKey, ClassTier> = Object.fromEntries(
  CLASS_TIERS.map((c) => [c.key, c]),
) as Record<ClassKey, ClassTier>;
