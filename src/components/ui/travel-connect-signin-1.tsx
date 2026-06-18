import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ChakraMark } from "../../lib/brand";
import { A11yControls } from "../A11yControls";
import { useSession } from "../../features/auth/session";

/**
 * data.amaravati — Single sign-on page.
 * (Originally scaffolded from a "travel-connect" template; rebuilt on the
 * platform's gov-credible design system — themed tokens, serif display, the
 * abstract chakra mark, and an on-brand "governed data network" canvas.)
 */

/* ---------- on-brand animated network (replaces the generic world dot-map) ---------- */
const EM = "16,160,106"; // emerald — growth / the blue-green network
const AZ = "37,99,235"; // azure — the open sky / the future

function GovNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Node = { x: number; y: number; r: number; hub: boolean };
    type Route = { a: Node; b: Node; delay: number; color: string };
    let nodes: Node[] = [];
    let routes: Route[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    const start = Date.now();
    const dpr = Math.min(devicePixelRatio || 1, 2);

    function build() {
      if (!canvas || !ctx) return;
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      const gap = 26;
      for (let x = gap; x < w; x += gap) {
        for (let y = gap; y < h; y += gap) {
          const nx = (x - w / 2) / (w / 2);
          const ny = (y - h / 2) / (h / 2);
          if (nx * nx + ny * ny > 1.04) continue; // soft elliptical mask
          if (Math.random() > 0.82) continue; // sparse, organic
          nodes.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            r: 1.1,
            hub: false,
          });
        }
      }
      const hubs: Node[] = [];
      for (let i = 0; i < 6 && nodes.length; i++) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        n.hub = true;
        n.r = 3.2;
        hubs.push(n);
      }
      routes = hubs.map((a, i) => ({
        a,
        b: hubs[(i + 1) % hubs.length],
        delay: i * 0.7,
        color: i % 2 ? AZ : EM,
      }));
    }

    function frame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.hub ? `rgba(${AZ},0.9)` : `rgba(${EM},0.3)`;
        ctx.fill();
      });

      const t = (Date.now() - start) / 1000;
      routes.forEach((rt) => {
        // faint base edge
        ctx.beginPath();
        ctx.moveTo(rt.a.x, rt.a.y);
        ctx.lineTo(rt.b.x, rt.b.y);
        ctx.strokeStyle = `rgba(${rt.color},0.14)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const dur = 2.4;
        const p = reduce ? 1 : ((t - rt.delay + 100) % (dur + 1.2)) / dur;
        if (p < 0 || p > 1) return;
        const x = rt.a.x + (rt.b.x - rt.a.x) * p;
        const y = rt.a.y + (rt.b.y - rt.a.y) * p;

        // travelling trail
        ctx.beginPath();
        ctx.moveTo(rt.a.x, rt.a.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(${rt.color},0.5)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // glowing packet head
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rt.color},0.18)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rt.color},1)`;
        ctx.fill();
      });

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    build();
    frame();

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) frame();
    });
    ro.observe(parent);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) frame();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ---------- form primitives, on the app's tokens ---------- */
const labelCls = "mb-1.5 block text-2xs font-medium uppercase tracking-wide text-ink-muted";
const inputCls =
  "h-11 w-full rounded-xl border border-line-soft bg-paper-2 px-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

/* ---------- sign-in card ---------- */
function SignInCard() {
  const navigate = useNavigate();
  const { signIn, session } = useSession();
  const reduce = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const enter = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: "easeOut" as const },
        };

  function completeSignIn(name: string, mail: string) {
    signIn({ name, email: mail, persona: session?.persona || "citizen" });
    navigate("/");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Enter a valid work email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setError("");
    completeSignIn(email.trim().split("@")[0].replace(/[._-]+/g, " "), email.trim());
  }

  return (
    <motion.div
      {...(reduce ? {} : { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, ease: "easeOut" as const } })}
      className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-line-soft bg-paper shadow-lift md:grid-cols-2"
    >
      {/* Left — branded network panel */}
      <div className="relative hidden min-h-[600px] overflow-hidden border-r border-line-soft bg-gradient-to-br from-brand/10 via-paper-2 to-green/10 md:block">
        <GovNetwork />
        <div className="absolute inset-0 bg-gradient-to-t from-paper/85 via-transparent to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center">
          <motion.div {...enter(0.15)}>
            <ChakraMark className="h-14 w-14" />
          </motion.div>
          <motion.h2 {...enter(0.25)} className="mt-6 font-serif text-3xl tracking-tight">
            data
            <span className="bg-gradient-to-r from-green to-brand bg-clip-text text-transparent">
              .amaravati
            </span>
          </motion.h2>
          <motion.p {...enter(0.35)} className="mt-3 max-w-xs text-sm text-ink-muted">
            Sign in to the governed data platform of the People's Capital — access city data by your
            authority, under consent and audit.
          </motion.p>
          <motion.div {...enter(0.45)} className="mt-7 flex flex-wrap justify-center gap-2">
            {["Single sign-on", "Consent-bound", "Audit-logged"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-line-soft bg-paper/70 px-3 py-1 font-mono text-2xs uppercase tracking-wide text-ink-muted backdrop-blur"
              >
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 px-10 pb-6 text-center font-mono text-2xs text-ink-faint">
          Concept — not an official Government of AP / APCRDA product.
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center p-8 sm:p-10 md:p-12">
        <motion.div {...enter(0.1)}>
          <span className="eyebrow mb-3">Secure sign-on</span>
          <h1 className="font-serif text-[clamp(1.7rem,3vw,2.2rem)] leading-tight">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink-muted">Sign in to your data.amaravati account.</p>
        </motion.div>

        <motion.button
          {...enter(0.18)}
          type="button"
          onClick={() => completeSignIn("Guest", "guest@amaravati.gov.in")}
          className="mt-7 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-paper-2 text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-paper"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </motion.button>

        <motion.div {...enter(0.24)} className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-line-soft" />
          <span className="font-mono text-2xs uppercase tracking-wide text-ink-faint">
            or with email
          </span>
          <span className="h-px flex-1 bg-line-soft" />
        </motion.div>

        <motion.form {...enter(0.3)} className="space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="email" className={labelCls}>
              Work email <span className="text-brand">*</span>
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@department.gov.in"
              className={inputCls}
              aria-invalid={!!error && !email}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className={labelCls}>
              Password <span className="text-brand">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${inputCls} pr-11`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink-faint hover:text-ink"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-2xs font-medium text-confidential">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-2xs text-ink-muted">
              <input type="checkbox" className="h-3.5 w-3.5 rounded border-line accent-brand" />
              Keep me signed in
            </label>
            <a href="#" className="text-2xs font-medium text-brand hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green to-brand text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgb(var(--brand)/0.55)] transition-all hover:brightness-[1.06] focus-visible:outline-3"
          >
            Sign in
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.form>

        <motion.p {...enter(0.36)} className="mt-6 text-center text-2xs text-ink-faint">
          New here?{" "}
          <Link to="/" className="font-medium text-brand hover:underline">
            Explore the platform
          </Link>{" "}
          — every request is consent-bound and audit-logged.
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <main id="main" className="flex min-h-dvh flex-col bg-paper">
      <header className="wrap flex items-center justify-between gap-4 py-5">
        <Link to="/" className="flex items-center gap-2.5 text-sm text-ink-muted hover:text-ink">
          <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
          <span className="font-serif text-base text-ink">
            data<span className="text-brand">.amaravati</span>
          </span>
        </Link>
        <A11yControls />
      </header>
      <div className="flex flex-1 items-center justify-center px-4 pb-12">
        <SignInCard />
      </div>
    </main>
  );
}
