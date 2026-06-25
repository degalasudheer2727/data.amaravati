import { Link } from "react-router-dom";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";
import type { ClassKey } from "../lib/classification";
import { CLASS_BY_KEY } from "../lib/classification";

/* ---------- section scaffolding ---------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export function SectionHead({
  kicker,
  title,
  intro,
  className,
}: {
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 max-w-prose2", className)}>
      <Eyebrow className="mb-3.5">{kicker}</Eyebrow>
      <h2 className="text-balance text-[clamp(1.7rem,3.6vw,2.7rem)] font-bold leading-[1.06] tracking-[-0.03em]">{title}</h2>
      {intro && <p className="mt-4 text-[1.05rem] text-ink-muted">{intro}</p>}
    </div>
  );
}

/** Accent emphasis used in headings (Apple: solid colour, not italics). */
export function Em({ children }: { children: ReactNode }) {
  return <em className="not-italic text-brand">{children}</em>;
}

/* ---------- classification badge ---------- */
const CLS_TEXT: Record<ClassKey, string> = {
  open: "text-open",
  internal: "text-internal",
  sensitive: "text-sensitive",
  confidential: "text-confidential",
};

export function ClassBadge({
  k,
  suffix,
  className,
}: {
  k: ClassKey;
  suffix?: string;
  className?: string;
}) {
  const tier = CLASS_BY_KEY[k];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-current px-2.5 py-0.5 text-2xs font-semibold uppercase tracking-wide",
        CLS_TEXT[k],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {tier.title}
      {suffix ? <span className="font-normal normal-case opacity-80">· {suffix}</span> : null}
    </span>
  );
}

/* ---------- buttons & links ---------- */
type Variant = "primary" | "ghost" | "subtle";
const VARIANT: Record<Variant, string> = {
  primary: "bg-brand text-white border-transparent hover:bg-brand-2 hover:scale-[1.015]",
  ghost: "border-line text-ink bg-paper/70 backdrop-blur hover:border-ink",
  subtle: "border-line-soft text-ink-muted bg-paper-2 hover:text-ink hover:border-line",
};
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-[-0.01em] transition-all duration-200 ease-gov focus-visible:outline-3 cursor-pointer disabled:opacity-50 active:scale-[.98]";

export function Btn({
  variant = "primary",
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(BASE, VARIANT[variant], className)} {...rest} />;
}

export function BtnLink({
  variant = "primary",
  to,
  external,
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  to: string;
  external?: boolean;
}) {
  const cls = cn(BASE, VARIANT[variant], className);
  if (external || to.startsWith("http")) {
    return (
      <a href={to} className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

/* ---------- surfaces ---------- */
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line-soft bg-paper-2 p-6 shadow-card transition-all duration-300 ease-appleout",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function KpiStat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="bg-paper p-7">
      <div className="text-[clamp(2rem,3.6vw,2.9rem)] font-semibold leading-none tracking-[-0.03em] text-ink tabular">
        {value}
        {unit && <span className="text-base font-semibold text-brand">{unit}</span>}
      </div>
      <div className="mt-2.5 text-2xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </div>
    </div>
  );
}
