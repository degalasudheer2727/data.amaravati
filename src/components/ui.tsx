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
      <h2 className="text-balance text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.08]">{title}</h2>
      {intro && <p className="mt-4 text-ink-muted">{intro}</p>}
    </div>
  );
}

/** Italic serif emphasis used in headings. */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-serif italic text-brand">{children}</em>;
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
  primary:
    "bg-brand text-white border-transparent hover:bg-brand-2 shadow-[0_12px_30px_-14px_rgb(var(--brand)/0.6)]",
  ghost: "border-line text-ink bg-paper hover:border-brand hover:text-brand",
  subtle: "border-line-soft text-ink-muted bg-paper-2 hover:text-ink hover:border-line",
};
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-gov focus-visible:outline-3 cursor-pointer disabled:opacity-50";

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
        "rounded-card border border-line-soft bg-paper-2 p-6 shadow-card transition-all duration-200 ease-gov",
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
      <div className="font-serif text-[clamp(1.9rem,3.4vw,2.7rem)] leading-none text-ink tabular">
        {value}
        {unit && <span className="text-base text-brand">{unit}</span>}
      </div>
      <div className="mt-2.5 text-2xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </div>
    </div>
  );
}
