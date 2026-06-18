import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "../lib/brand";
import { A11yControls } from "./A11yControls";
import { BtnLink } from "./ui";
import { cn } from "../lib/cn";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export function SiteHeader({
  links,
  cta,
  brandSubtitle,
  rightSlot,
  tone = "light",
}: {
  links: NavLink[];
  cta?: { label: string; to: string; external?: boolean };
  brandSubtitle?: string;
  rightSlot?: import("react").ReactNode;
  /** "overDark" renders white nav text while at the top of a dark hero. */
  tone?: "light" | "overDark";
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dark = tone === "overDark" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* GIGW gov utility bar */}
      <div className="bg-navy text-white/90">
        <div className="wrap flex h-9 items-center gap-3 text-2xs">
          <span className="hidden sm:inline">
            <strong className="font-semibold text-white">Concept</strong> — not an official Government
            of AP / APCRDA product.
          </span>
          <span className="flex-1" />
          <A11yControls className="[&_button]:border-white/25 [&_button]:text-white/80 [&_button:hover]:bg-white/15 [&_button:hover]:text-white" />
        </div>
      </div>

      {/* primary nav */}
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled
            ? "border-line-soft bg-paper/85 backdrop-blur-md"
            : "border-transparent bg-paper/0",
        )}
      >
        <nav className="wrap flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="data.amaravati home" className="flex-none">
            <Wordmark subtitle={brandSubtitle ?? "Governed Data Platform"} light={dark} />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {links.map((l) => {
              const linkCls = cn(
                "text-sm transition-colors",
                dark ? "text-white/80 hover:text-white" : "text-ink-muted hover:text-ink",
              );
              return l.external || l.href.startsWith("http") || l.href.startsWith("/") ? (
                <Link key={l.href} to={l.href} className={linkCls}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                </a>
              );
            })}
            {cta && (
              <BtnLink to={cta.to} external={cta.external} className="px-4 py-2 text-[13px]">
                {cta.label}
              </BtnLink>
            )}
            {rightSlot}
          </div>

          <button
            type="button"
            className={cn(
              "rounded-md border p-2 lg:hidden",
              dark ? "border-white/40 text-white" : "border-line text-ink",
            )}
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>

        {open && (
          <div className="border-t border-line-soft bg-paper lg:hidden">
            <div className="wrap flex flex-col gap-1 py-3">
              {links.map((l) => {
                const cls =
                  "rounded-lg px-2 py-2.5 text-sm text-ink-muted hover:bg-ink/5 hover:text-ink";
                return l.href.startsWith("/") ? (
                  <Link key={l.href} to={l.href} className={cls} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.href} href={l.href} className={cls} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                );
              })}
              {cta && (
                <BtnLink to={cta.to} external={cta.external} className="mt-2 w-full">
                  {cta.label}
                </BtnLink>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
