import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import { Paperclip, Command as CommandIcon, SendHorizontal, Loader2, X } from "lucide-react";
import { ChakraMark } from "../../lib/brand";
import { Icon } from "../../components/Icon";
import { cn } from "../../lib/cn";
import { getReply, SUGGESTIONS, type ChatAction } from "./engine";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAction[];
}

interface SlashCommand {
  prefix: string;
  label: string;
  description: string;
  icon: string;
  query: string;
}

const SLASH: SlashCommand[] = [
  { prefix: "/catalogue", label: "Catalogue", description: "Browse the governed catalogue", icon: "database", query: "show me the catalogue" },
  { prefix: "/access", label: "Access", description: "Classification & access model", icon: "shield", query: "explain the classification tiers" },
  { prefix: "/exchange", label: "Exchange", description: "CRDA exchange hub", icon: "exchange", query: "how does the crda exchange work" },
  { prefix: "/cockpit", label: "Cockpit", description: "Leadership decision cockpit", icon: "gauge", query: "show me the leadership cockpit" },
  { prefix: "/aqi", label: "Air quality", description: "Live air quality", icon: "spark", query: "what's the current air quality" },
  { prefix: "/visit", label: "Visit", description: "Visit Amaravati guide", icon: "map", query: "visit amaravati" },
];

let counter = 0;
const nextId = () => ++counter;

/* auto-resizing textarea */
function useAutoResize(minHeight: number, maxHeight: number) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const adjust = useCallback(
    (reset?: boolean) => {
      const el = ref.current;
      if (!el) return;
      el.style.height = `${minHeight}px`;
      if (reset) return;
      el.style.height = `${Math.max(minHeight, Math.min(el.scrollHeight, maxHeight))}px`;
    },
    [minHeight, maxHeight],
  );
  return { ref, adjust };
}

export function AssistantChat({ initialQuestion }: { initialQuestion?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeCmd, setActiveCmd] = useState(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const reduce = useRef(matchMedia("(prefers-reduced-motion: reduce)").matches);
  const sentInitial = useRef(false);
  const { ref: textareaRef, adjust } = useAutoResize(52, 160);

  const typingSlash = input.startsWith("/") && !input.includes(" ");
  const commandList = typingSlash ? SLASH.filter((c) => c.prefix.startsWith(input)) : SLASH;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => () => timers.current.forEach((t) => clearInterval(t)), []);

  // open palette while typing a slash command
  useEffect(() => {
    if (typingSlash) {
      setPaletteOpen(true);
      setActiveCmd(commandList.length ? 0 : -1);
    } else if (!input) {
      setPaletteOpen((p) => p && false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  // close palette on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      const btn = document.querySelector("[data-command-button]");
      if (paletteRef.current && !paletteRef.current.contains(t) && !btn?.contains(t)) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function send(raw: string) {
    const text = raw.trim();
    if (!text || thinking) return;
    setInput("");
    setPaletteOpen(false);
    adjust(true);
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setThinking(true);

    const reply = getReply(text);
    const delay = window.setTimeout(() => {
      setThinking(false);
      const id = nextId();
      setMessages((m) => [...m, { id, role: "assistant", text: "", actions: reply.actions }]);
      if (reduce.current) {
        setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: reply.text } : msg)));
        return;
      }
      const words = reply.text.split(" ");
      let i = 0;
      const iv = window.setInterval(() => {
        i += 1;
        setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: words.slice(0, i).join(" ") } : msg)));
        if (i >= words.length) window.clearInterval(iv);
      }, 26);
      timers.current.push(iv);
    }, 480);
    timers.current.push(delay);
  }

  useEffect(() => {
    if (initialQuestion && !sentInitial.current) {
      sentInitial.current = true;
      send(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  function runCommand(cmd: SlashCommand) {
    setPaletteOpen(false);
    send(cmd.query);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (paletteOpen && commandList.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveCmd((p) => (p < commandList.length - 1 ? p + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveCmd((p) => (p > 0 ? p - 1 : commandList.length - 1));
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setPaletteOpen(false);
        return;
      }
      if ((e.key === "Tab" || e.key === "Enter") && activeCmd >= 0) {
        e.preventDefault();
        runCommand(commandList[activeCmd]);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const empty = messages.length === 0 && !thinking;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* message log */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Assistant conversation"
        className="flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          {empty && (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-line-soft bg-paper-2">
                <ChakraMark className="h-9 w-9" />
              </div>
              <h2 className="mt-5 bg-gradient-to-r from-ink to-ink-muted bg-clip-text font-serif text-[clamp(1.6rem,3.2vw,2.1rem)] leading-tight text-transparent">
                How can I help with city data?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
                Type a command (/) or ask about the catalogue, the four confidentiality tiers, the CRDA
                exchange, or the city's live figures.
              </p>
              <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-line-soft bg-paper-2 px-3.5 py-2 text-[13px] text-ink-muted transition-colors hover:border-brand hover:text-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm text-white">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-line-soft bg-paper-2">
                  <ChakraMark className="h-5 w-5" />
                </span>
                <div className="max-w-[85%]">
                  <div className="whitespace-pre-wrap rounded-2xl rounded-tl-md border border-line-soft bg-paper-2 px-4 py-3 text-sm leading-relaxed text-ink">
                    {m.text || <TypingDots />}
                  </div>
                  {m.actions && m.text && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.actions.map((a) => (
                        <Link
                          key={a.label}
                          to={a.to}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-2xs font-semibold text-brand transition-colors hover:border-brand"
                        >
                          {a.label}
                          <Icon name="arrow" className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ),
          )}

          {thinking && (
            <div className="flex gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-line-soft bg-paper-2">
                <ChakraMark className="h-5 w-5" />
              </span>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-line-soft bg-paper-2 px-4 py-3.5 text-sm text-ink-muted">
                <span>Thinking</span>
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* composer */}
      <div className="px-4 pb-5 pt-2">
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-2xl border border-line-soft bg-paper-2/80 shadow-card backdrop-blur transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25">
            {/* slash-command palette */}
            {paletteOpen && commandList.length > 0 && (
              <div
                ref={paletteRef}
                className="absolute bottom-full left-3 right-3 z-50 mb-2 overflow-hidden rounded-xl border border-line-soft bg-paper shadow-lift"
              >
                <div className="py-1">
                  {commandList.map((cmd, index) => (
                    <button
                      key={cmd.prefix}
                      onMouseEnter={() => setActiveCmd(index)}
                      onClick={() => runCommand(cmd)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                        activeCmd === index ? "bg-brand/10 text-ink" : "text-ink-muted hover:bg-ink/5",
                      )}
                    >
                      <span className="grid h-6 w-6 place-items-center text-ink-faint">
                        <Icon name={cmd.icon} className="h-4 w-4" />
                      </span>
                      <span className="font-medium">{cmd.label}</span>
                      <span className="text-2xs text-ink-faint">{cmd.description}</span>
                      <span className="ml-auto font-mono text-2xs text-ink-faint">{cmd.prefix}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label htmlFor="ai-input" className="sr-only">
              Message the assistant
            </label>
            <textarea
              id="ai-input"
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjust();
              }}
              onKeyDown={onKeyDown}
              placeholder="Ask about datasets, access, the exchange… or type /"
              className="block max-h-40 w-full resize-none bg-transparent px-4 py-3.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {attachments.map((file, index) => (
                  <span key={index} className="flex items-center gap-1.5 rounded-lg border border-line-soft bg-paper px-2.5 py-1 text-2xs text-ink-muted">
                    {file}
                    <button
                      onClick={() => setAttachments((a) => a.filter((_, i) => i !== index))}
                      aria-label={`Remove ${file}`}
                      className="text-ink-faint hover:text-ink"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-line-soft px-3 py-2.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAttachments((a) => [...a, `dataset-${Math.floor(Math.random() * 1000)}.csv`])}
                  aria-label="Attach a file"
                  className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  data-command-button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaletteOpen((p) => !p);
                    setActiveCmd(0);
                  }}
                  aria-label="Slash commands"
                  className={cn(
                    "rounded-lg p-2 transition-colors hover:bg-ink/5",
                    paletteOpen ? "bg-brand/10 text-brand" : "text-ink-faint hover:text-ink",
                  )}
                >
                  <CommandIcon className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => send(input)}
                disabled={!input.trim() || thinking}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green to-brand px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
              >
                {thinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                <span>Send</span>
              </button>
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-2xs text-ink-faint">
            Concept assistant · consent-bound · audit-logged · figures are indicative
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1.5" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
        />
      ))}
    </span>
  );
}
