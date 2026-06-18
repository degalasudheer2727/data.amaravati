import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AiLauncher } from "./components/AiLauncher";

const Platform = lazy(() => import("./pages/Platform"));
const CommandCenter = lazy(() => import("./pages/CommandCenter"));
const Visit = lazy(() => import("./pages/Visit"));
const Assistant = lazy(() => import("./pages/Assistant"));
const Login = lazy(() => import("./components/ui/travel-connect-signin-1"));

/** Scroll to top on navigation, or to the hash target if present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

function PageFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper text-ink-faint">
      <span className="font-mono text-2xs uppercase tracking-[0.3em]">Loading…</span>
    </div>
  );
}

export function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <ScrollManager />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Platform />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Platform />} />
        </Routes>
      </Suspense>
      <AiLauncher />
    </>
  );
}
