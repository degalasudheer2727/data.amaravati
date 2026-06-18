import { Link, useSearchParams } from "react-router-dom";
import { ChakraMark } from "../lib/brand";
import { A11yControls } from "../components/A11yControls";
import { Icon } from "../components/Icon";
import { AssistantChat } from "../features/assistant/AssistantChat";

export default function Assistant() {
  const [params] = useSearchParams();
  const initialQuestion = params.get("q") || undefined;

  return (
    <main id="main" className="relative flex h-dvh flex-col overflow-hidden bg-paper">
      {/* ambient brand glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-green/10 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-brand/10 blur-[130px] [animation-delay:700ms]" />
        <div className="absolute right-1/3 top-1/3 h-64 w-64 animate-pulse rounded-full bg-gold/10 blur-[96px] [animation-delay:1000ms]" />
      </div>
      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-line-soft bg-paper/70 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to data.amaravati"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line-soft text-ink-muted hover:border-brand hover:text-ink"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
          </Link>
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-line-soft bg-paper-2">
            <ChakraMark className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-serif text-base">
              data<span className="text-brand">.amaravati</span> Assistant
            </div>
            <div className="flex items-center gap-1.5 text-2xs text-ink-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-green" /> Online · governed
            </div>
          </div>
        </div>
        <A11yControls />
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <AssistantChat initialQuestion={initialQuestion} />
      </div>
    </main>
  );
}
