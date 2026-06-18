import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface Session {
  name: string;
  email: string;
  persona: string;
}

interface SessionCtx {
  session: Session | null;
  signIn: (s: Session) => void;
  setPersona: (persona: string) => void;
  signOut: () => void;
}

const KEY = "dav_session";
const Ctx = createContext<SessionCtx | null>(null);

function read(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
function write(s: Session | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(read);

  const signIn = useCallback((s: Session) => {
    setSession(s);
    write(s);
  }, []);
  const setPersona = useCallback((persona: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, persona };
      write(next);
      return next;
    });
  }, []);
  const signOut = useCallback(() => {
    setSession(null);
    write(null);
  }, []);

  return <Ctx.Provider value={{ session, signIn, setPersona, signOut }}>{children}</Ctx.Provider>;
}

export function useSession() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
