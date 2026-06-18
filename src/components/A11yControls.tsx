import { useTheme } from "./ThemeProvider";
import { cn } from "../lib/cn";
import { ThemeToggle } from "./ui/theme-toggle";

/**
 * GIGW accessibility controls: text resize, high-contrast, dark mode.
 * Compact button group reused in every page header.
 */
export function A11yControls({ className }: { className?: string }) {
  const { contrast, fontStep, toggleContrast, setFontStep } = useTheme();
  const btn =
    "rounded-md border border-line-soft px-2 py-1 text-xs text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:text-ink";
  const on = "bg-brand text-white border-transparent hover:bg-brand";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div role="group" aria-label="Text size" className="flex items-center gap-0.5">
        <button type="button" className={btn} onClick={() => setFontStep(fontStep - 1)} aria-label="Decrease text size">
          A−
        </button>
        <button type="button" className={btn} onClick={() => setFontStep(0)} aria-label="Reset text size">
          A
        </button>
        <button type="button" className={btn} onClick={() => setFontStep(fontStep + 1)} aria-label="Increase text size">
          A+
        </button>
      </div>
      <button
        type="button"
        className={cn(btn, contrast && on)}
        aria-pressed={contrast}
        onClick={toggleContrast}
      >
        High contrast
      </button>
      <ThemeToggle size="sm" />
    </div>
  );
}
