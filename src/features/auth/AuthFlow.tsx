import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "./session";
import { ChakraMark } from "../../lib/brand";
import { Btn, ClassBadge } from "../../components/ui";
import { CLASS_TIERS, type ClassKey } from "../../lib/classification";
import { PERSONAS, PERSONA_BY_KEY, DATASETS, ENTITIES, type Dataset } from "../../data/platform";

type Step = "signin" | "persona" | "request" | "exchange" | "done" | "exchangeDone";

interface FlowCtx {
  openSignIn: () => void;
  openRequest: (ds: Dataset) => void;
  openExchange: () => void;
}
const Ctx = createContext<FlowCtx | null>(null);

export function useAuthFlow() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthFlow must be used within AuthFlowProvider");
  return ctx;
}

const Steps = ({ n }: { n: number }) => (
  <div className="mb-6 flex gap-2" aria-hidden>
    {[1, 2, 3].map((i) => (
      <span
        key={i}
        className={`h-1 flex-1 rounded-full ${i <= n ? "bg-brand" : "bg-line-soft"}`}
      />
    ))}
  </div>
);

export function AuthFlowProvider({ children }: { children: ReactNode }) {
  const { session, signIn, setPersona, signOut } = useSession();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("signin");
  const [pending, setPending] = useState<Dataset | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<Element | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setPending(null);
    if (lastFocus.current instanceof HTMLElement) lastFocus.current.focus();
  }, []);

  const launch = useCallback(
    (s: Step, ds: Dataset | null = null) => {
      lastFocus.current = document.activeElement;
      setPending(ds);
      setStep(session ? s : "signin");
      setOpen(true);
    },
    [session],
  );

  const flow: FlowCtx = {
    openSignIn: () => launch("persona"),
    openRequest: (ds) => launch("request", ds),
    openExchange: () => launch("exchange"),
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input,select,button")?.focus();
    }, 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, step, close]);

  return (
    <Ctx.Provider value={flow}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Account & data access"
            className="relative max-h-[92vh] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-line bg-paper p-8 shadow-lift"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close dialog"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-line-soft text-ink-muted hover:border-brand hover:text-ink"
            >
              ✕
            </button>
            <ChakraMark className="mb-4 h-11 w-11" />

            {step === "signin" && (
              <SignIn
                pending={pending}
                onSubmit={(name, email) => {
                  signIn({ name, email, persona: session?.persona || "citizen" });
                  setStep("persona");
                }}
              />
            )}
            {step === "persona" && session && (
              <PersonaPick
                current={session.persona}
                pending={pending}
                onSignOut={() => {
                  signOut();
                  setStep("signin");
                }}
                onContinue={(p) => {
                  setPersona(p);
                  setStep(pending ? "request" : "done");
                }}
              />
            )}
            {step === "request" && session && pending && (
              <RequestStep
                ds={pending}
                persona={session.persona}
                onBack={() => setStep("persona")}
                onSubmit={() => setStep("done")}
              />
            )}
            {step === "exchange" && session && (
              <ExchangeStep persona={session.persona} onCancel={close} onSubmit={() => setStep("exchangeDone")} />
            )}
            {step === "done" && session && <DoneStep email={session.email} persona={session.persona} ds={pending} onClose={close} />}
            {step === "exchangeDone" && <ExchangeDone onClose={close} />}
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

/* ---------- step components ---------- */
function DsContext({ ds }: { ds: Dataset | null }) {
  if (!ds) return null;
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-line-soft bg-paper-2 px-3.5 py-3 text-sm text-ink-muted">
      <ClassBadge k={ds.cls} />
      <span>
        Requesting <strong className="text-ink">{ds.title}</strong> · {ds.ent}
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-2xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
const inputCls =
  "w-full rounded-xl border border-line-soft bg-paper-2 px-3.5 py-3 text-sm text-ink focus:border-brand focus:outline-none";

function SignIn({ pending, onSubmit }: { pending: Dataset | null; onSubmit: (n: string, e: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <>
      <div className="mb-2.5 font-mono text-2xs uppercase tracking-[0.2em] text-brand">
        data.amaravati · Single sign-on
      </div>
      <h3 className="text-2xl">Sign in to request data</h3>
      <p className="mb-5 mt-2 text-sm text-ink-muted">
        Sign in to reach the catalogue, your role's data envelope and your request history.
      </p>
      <DsContext ds={pending} />
      <Steps n={1} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
            onSubmit(name.trim(), email.trim());
        }}
      >
        <Field label="Full name">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required />
        </Field>
        <Field label="Work email">
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@department.gov.in" autoComplete="email" required />
        </Field>
        <Btn type="submit" className="w-full">
          Continue →
        </Btn>
      </form>
      <p className="mt-4 text-2xs leading-relaxed text-ink-faint">
        By continuing you agree to the Terms of Use, Privacy Policy and the inter-agency data-sharing
        code of conduct. Access is consent-bound and every request is audit-logged.
      </p>
    </>
  );
}

function AccessPreview({ persona }: { persona: string }) {
  const p = PERSONA_BY_KEY[persona];
  if (!p) return null;
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {CLASS_TIERS.map((c) => {
        const a = p.access[c.key];
        return (
          <ClassBadge
            key={c.key}
            k={c.key}
            suffix={a === "y" ? "✓" : a === "c" ? "agreement" : "closed"}
            className={a === "n" ? "opacity-40" : ""}
          />
        );
      })}
    </div>
  );
}

function PersonaPick({
  current,
  pending,
  onSignOut,
  onContinue,
}: {
  current: string;
  pending: Dataset | null;
  onSignOut: () => void;
  onContinue: (p: string) => void;
}) {
  const [persona, setPersona] = useState(current);
  return (
    <>
      <div className="mb-2.5 font-mono text-2xs uppercase tracking-[0.2em] text-brand">Welcome</div>
      <h3 className="text-2xl">Choose your persona</h3>
      <p className="mb-5 mt-2 text-sm text-ink-muted">
        Your persona sets a default access envelope across the four confidentiality tiers. A Data
        Steward can change it later.
      </p>
      <DsContext ds={pending} />
      <Steps n={2} />
      <Field label="I am a…">
        <select className={inputCls} value={persona} onChange={(e) => setPersona(e.target.value)}>
          {PERSONAS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>
      <AccessPreview persona={persona} />
      <div className="flex gap-3">
        <Btn variant="ghost" onClick={onSignOut}>
          Sign out
        </Btn>
        <Btn className="flex-[2]" onClick={() => onContinue(persona)}>
          {pending ? "Continue to request →" : "Enter the platform →"}
        </Btn>
      </div>
    </>
  );
}

function RequestStep({
  ds,
  persona,
  onBack,
  onSubmit,
}: {
  ds: Dataset;
  persona: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const a = PERSONA_BY_KEY[persona].access[ds.cls];
  const verdict =
    a === "y"
      ? { h: "Instant access", t: "Your persona may use this tier directly. An API key & download link are issued on submit.", tone: "text-open" }
      : a === "c"
        ? { h: "Access on agreement", t: "This tier needs a short purpose review and a data-sharing agreement. We'll route your request to the data steward.", tone: "text-sensitive" }
        : { h: "Requires clearance", t: "This tier is above your current authority. Submit a clearance request — routed to the Data Steward and DPO for need-to-know review before any release.", tone: "text-confidential" };
  return (
    <>
      <div className="mb-2.5 font-mono text-2xs uppercase tracking-[0.2em] text-brand">Request access</div>
      <h3 className="text-2xl">{ds.title}</h3>
      <p className="mb-4 mt-2 text-sm text-ink-muted">{ds.desc}</p>
      <DsContext ds={ds} />
      <Steps n={3} />
      <div className={`mb-4 rounded-xl border border-current px-4 py-3 text-sm ${verdict.tone}`}>
        <strong>{verdict.h}.</strong> <span className="text-ink-muted">{verdict.t}</span>
      </div>
      <Field label="Purpose of use">
        <input className={inputCls} placeholder="e.g. ward-level mobility research" />
      </Field>
      <div className="flex gap-3">
        <Btn variant="ghost" onClick={onBack}>
          Back
        </Btn>
        <Btn className="flex-[2]" onClick={onSubmit}>
          Submit request
        </Btn>
      </div>
    </>
  );
}

function ExchangeStep({
  persona,
  onCancel,
  onSubmit,
}: {
  persona: string;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const govt = ["agency", "partner", "steward"].includes(persona);
  const [cls, setCls] = useState<ClassKey>(DATASETS[0].cls);
  const msg =
    cls === "open"
      ? "Open exchange — registered and logged, no agreement needed."
      : cls === "confidential"
        ? "Confidential — CRDA approval is unlikely; strictly need-to-know."
        : "Routed to CRDA for a time-boxed data-sharing agreement.";
  return (
    <>
      <div className="mb-2.5 font-mono text-2xs uppercase tracking-[0.2em] text-brand">
        Data Exchange Hub · governed by CRDA
      </div>
      <h3 className="text-2xl">Propose a data exchange</h3>
      <p className="mb-5 mt-2 text-sm text-ink-muted">
        Request data from another government entity. The hub classifies it and routes the proposal to
        CRDA before any exchange begins.
      </p>
      {!govt && (
        <div className="mb-5 rounded-xl border border-sensitive/40 bg-sensitive/5 px-4 py-3 text-2xs leading-relaxed text-ink-muted">
          Exchanges run between government entities. You can preview the flow, but a Government Agency,
          Infrastructure Partner or Data Steward persona is needed to submit one.
        </div>
      )}
      <Field label="Provider entity">
        <select className={inputCls}>
          {ENTITIES.filter((e) => !e.gov).map((e) => (
            <option key={e.abbr}>{e.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Dataset requested">
        <select className={inputCls} value={cls} onChange={(e) => setCls(e.target.value as ClassKey)}>
          {DATASETS.map((d) => (
            <option key={d.title} value={d.cls}>
              {d.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Purpose & legal basis">
        <input className={inputCls} placeholder="e.g. inter-agency flood-risk modelling" />
      </Field>
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-line-soft bg-paper-2 px-3.5 py-3 text-sm text-ink-muted">
        <ClassBadge k={cls} />
        <span>{msg}</span>
      </div>
      <div className="flex gap-3">
        <Btn variant="ghost" onClick={onCancel}>
          Cancel
        </Btn>
        <Btn className="flex-[2]" onClick={onSubmit}>
          Submit to CRDA review →
        </Btn>
      </div>
    </>
  );
}

function Tick() {
  return (
    <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full border border-open bg-open/10 text-3xl text-open">
      ✓
    </div>
  );
}

function DoneStep({
  email,
  persona,
  ds,
  onClose,
}: {
  email: string;
  persona: string;
  ds: Dataset | null;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <Tick />
      <h3 className="text-2xl">You're in{ds ? " — request received" : ""}.</h3>
      <p className="mb-4 mt-2 text-sm text-ink-muted">
        Signed in as <strong className="text-ink">{email}</strong> · {PERSONA_BY_KEY[persona]?.title}
      </p>
      <ul className="mx-auto max-w-sm space-y-2 text-left text-sm text-ink-muted">
        {ds && (
          <li className="border-b border-line-soft pb-2">
            Request for <strong className="text-ink">{ds.title}</strong> logged with an audit reference
          </li>
        )}
        <li className="border-b border-line-soft pb-2">Public datasets are ready to download or call now</li>
        <li className="border-b border-line-soft pb-2">
          Internal & sensitive tiers route through governance per the access matrix
        </li>
        <li>Every request is consent-bound and audit-logged</li>
      </ul>
      <Btn className="mt-6 w-full" onClick={onClose}>
        Done
      </Btn>
    </div>
  );
}

function ExchangeDone({ onClose }: { onClose: () => void }) {
  const ref = "DX-AP-" + String(Math.floor(10000 + Math.abs(Math.sin(42) * 90000))).slice(0, 5);
  return (
    <div className="text-center">
      <Tick />
      <h3 className="text-2xl">Submitted to CRDA review.</h3>
      <p className="mb-4 mt-2 text-sm text-ink-muted">
        Exchange reference <strong className="text-ink">{ref}</strong>
      </p>
      <ul className="mx-auto max-w-sm space-y-2 text-left text-sm text-ink-muted">
        <li className="border-b border-line-soft pb-2">CRDA verifies purpose, legal basis and consent (DPDP)</li>
        <li className="border-b border-line-soft pb-2">On approval a time-boxed data-sharing agreement is registered</li>
        <li className="border-b border-line-soft pb-2">A secure exchange channel opens between the two entities</li>
        <li>Every transaction is logged under CRDA oversight</li>
      </ul>
      <Btn className="mt-6 w-full" onClick={onClose}>
        Done
      </Btn>
    </div>
  );
}
