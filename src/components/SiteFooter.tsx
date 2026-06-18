import { Link } from "react-router-dom";
import { Wordmark } from "../lib/brand";

interface FootCol {
  title: string;
  links: { label: string; href: string }[];
}

const GIGW_POLICIES = [
  "Terms of Use",
  "Privacy Policy",
  "Accessibility Statement",
  "Copyright Policy",
  "Hyperlinking Policy",
  "Help",
];

export function SiteFooter({
  blurb,
  columns,
}: {
  blurb: string;
  columns: FootCol[];
}) {
  return (
    <footer className="border-t border-line-soft bg-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Wordmark subtitle={null} />
          <p className="mt-4 text-sm text-ink-muted">{blurb}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3.5 text-2xs font-semibold uppercase tracking-wide text-ink-muted">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label + l.href}>
                  {l.href.startsWith("/") ? (
                    <Link to={l.href} className="text-sm text-ink-muted hover:text-ink">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="text-sm text-ink-muted hover:text-ink">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap flex flex-wrap gap-x-6 gap-y-1 border-t border-line-soft py-4">
        {GIGW_POLICIES.map((p) => (
          <a key={p} href="#" className="text-2xs text-ink-faint hover:text-ink hover:underline">
            {p}
          </a>
        ))}
      </div>
    </footer>
  );
}
