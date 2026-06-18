import { Link, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

/** Persistent "Talk to AI" launcher — present across screens, hidden where it
 *  would be redundant (the assistant itself and the login page). */
export function AiLauncher() {
  const { pathname } = useLocation();
  if (pathname === "/assistant" || pathname === "/login") return null;

  return (
    <Link
      to="/assistant"
      aria-label="Talk to the data.amaravati AI assistant"
      className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-green to-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-16px_rgb(var(--brand)/0.65)] transition-transform hover:-translate-y-0.5 focus-visible:outline-3"
    >
      <Icon name="message" className="h-5 w-5" />
      <span className="hidden sm:inline">Talk to AI</span>
      <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-paper bg-saffron" />
    </Link>
  );
}
