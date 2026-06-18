import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Prefs = { dark: boolean; contrast: boolean; fontStep: number };
type Ctx = Prefs & {
  toggleDark: () => void;
  toggleContrast: () => void;
  setFontStep: (n: number) => void;
};

const FONT_SIZES = [14, 15, 16, 18, 20]; // step -2..+2, base index 2
const KEY = "dav_prefs";
const ThemeCtx = createContext<Ctx | null>(null);

function read(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { dark: !!raw.dark, contrast: !!raw.contrast, fontStep: raw.fontStep ?? 0 };
  } catch {
    return { dark: false, contrast: false, fontStep: 0 };
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(read);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", prefs.dark ? "dark" : "light");
    if (prefs.contrast) root.setAttribute("data-contrast", "high");
    else root.removeAttribute("data-contrast");
    const idx = Math.max(0, Math.min(4, 2 + prefs.fontStep));
    root.style.fontSize = FONT_SIZES[idx] + "px";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", prefs.dark ? "#080c16" : "#ffffff");
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  const value: Ctx = {
    ...prefs,
    toggleDark: () => setPrefs((p) => ({ ...p, dark: !p.dark })),
    toggleContrast: () => setPrefs((p) => ({ ...p, contrast: !p.contrast })),
    setFontStep: (n) => setPrefs((p) => ({ ...p, fontStep: Math.max(-2, Math.min(2, n)) })),
  };
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
