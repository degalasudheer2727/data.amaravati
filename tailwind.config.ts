import type { Config } from "tailwindcss";

/**
 * data.amaravati — gov-credible editorial design system.
 * Colours are driven by CSS custom properties (R G B channels) so the same
 * token set powers light, dark and high-contrast (GIGW) themes. See index.css.
 */
const withVar = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  // classification colour utilities are sometimes composed at runtime
  safelist: [
    "text-open", "text-internal", "text-sensitive", "text-confidential",
    "bg-open", "bg-internal", "bg-sensitive", "bg-confidential",
    "border-open", "border-internal", "border-sensitive", "border-confidential",
  ],
  theme: {
    extend: {
      colors: {
        paper: withVar("--paper"),
        "paper-2": withVar("--paper-2"),
        "paper-3": withVar("--paper-3"),
        ink: withVar("--ink"),
        "ink-muted": withVar("--ink-muted"),
        "ink-faint": withVar("--ink-faint"),
        line: withVar("--line"),
        "line-soft": withVar("--line-soft"),
        navy: withVar("--navy"),
        brand: withVar("--brand"),
        "brand-2": withVar("--brand-2"),
        saffron: withVar("--saffron"),
        green: withVar("--green"),
        gold: withVar("--gold"),
        // 4-tier confidentiality classification
        open: withVar("--cls-open"),
        internal: withVar("--cls-internal"),
        sensitive: withVar("--cls-sensitive"),
        confidential: withVar("--cls-confidential"),
        // shadcn-style semantic aliases (mapped onto the existing palette) so
        // imported shadcn/ui components resolve bg-primary / bg-background / etc.
        primary: withVar("--brand"),
        background: withVar("--paper"),
        foreground: withVar("--ink"),
        input: withVar("--line"),
        accent: withVar("--paper-2"),
        "accent-foreground": withVar("--ink"),
      },
      fontFamily: {
        // Full Apple pass: the display ("serif") token now resolves to the SF
        // Pro / system stack, so every legacy `font-serif` usage renders as SF.
        serif: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Display'",
          "'Inter Variable'",
          "Inter",
          "'Segoe UI'",
          "sans-serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Text'",
          "'Inter Variable'",
          "Inter",
          "'Segoe UI'",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "'SF Mono'",
          "'Cascadia Mono'",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1.4" }],
      },
      maxWidth: {
        content: "1200px",
        prose2: "68ch",
      },
      borderRadius: {
        card: "18px",
      },
      boxShadow: {
        card: "0 4px 16px rgb(var(--ink) / 0.06)",
        lift: "0 18px 48px -16px rgb(var(--ink) / 0.16)",
      },
      letterSpacing: {
        eyebrow: "0.14em",
      },
      transitionTimingFunction: {
        gov: "cubic-bezier(.4,0,.2,1)",
        appleout: "cubic-bezier(.16,1,.3,1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "none" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up .6s cubic-bezier(.2,.7,.2,1) both",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
