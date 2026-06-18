import { ThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeTogglePreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-sm text-ink-muted">
        Click the toggle to switch between light and dark mode.
      </p>
      <ThemeToggle size="md" />
    </div>
  );
}

export default ThemeTogglePreview;
