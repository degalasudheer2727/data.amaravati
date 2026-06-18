import { cn } from "./cn";

/**
 * Abstract chakra-inspired mark — an original interpretation.
 * Deliberately NOT the official State Emblem of Andhra Pradesh
 * (its use is legally restricted). A simple ring + spokes glyph.
 */
export function ChakraMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id="amaraMarkGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--brand))" />
          <stop offset="1" stopColor="rgb(var(--saffron))" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="none" stroke="url(#amaraMarkGrad)" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="3.4" fill="rgb(var(--saffron))" />
      <g stroke="rgb(var(--brand))" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        <line x1="24" y1="6" x2="24" y2="42" />
        <line x1="6" y1="24" x2="42" y2="24" />
        <line x1="11.3" y1="11.3" x2="36.7" y2="36.7" />
        <line x1="36.7" y1="11.3" x2="11.3" y2="36.7" />
      </g>
    </svg>
  );
}

/** Wordmark: data.amaravati with the suffix in the brand gradient. */
export function Wordmark({
  className,
  subtitle = "Governed Data Platform",
  light = false,
}: {
  className?: string;
  subtitle?: string | null;
  light?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <ChakraMark className="h-8 w-8 flex-none" />
      <span className="leading-none">
        <span className={cn("block font-serif text-lg leading-none tracking-tight", light && "text-white")}>
          data
          <span className="bg-gradient-to-r from-green to-brand bg-clip-text text-transparent">
            .amaravati
          </span>
        </span>
        {subtitle && (
          <span
            className={cn(
              "mt-1 block font-mono text-[9.5px] uppercase tracking-[0.16em]",
              light ? "text-white/60" : "text-ink-faint",
            )}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
