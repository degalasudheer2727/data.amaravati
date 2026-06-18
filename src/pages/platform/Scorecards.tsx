import { useMemo, useState } from "react";
import { useSession } from "../../features/auth/session";
import { useAuthFlow } from "../../features/auth/AuthFlow";
import { Btn } from "../../components/ui";
import { Icon } from "../../components/Icon";
import { ENTITIES, EXCHANGES, PERSONA_BY_KEY } from "../../data/platform";
import { entityScore, grade, isoWeek, KPI_STAT } from "../../lib/kpi";

function LockCard({
  icon,
  head,
  body,
  btn,
}: {
  icon: string;
  head: string;
  body: React.ReactNode;
  btn: string;
}) {
  const { openSignIn } = useAuthFlow();
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line bg-paper-2 px-7 py-11 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h4 className="font-serif text-xl">{head}</h4>
      <p className="mx-auto mt-2.5 max-w-md text-sm text-ink-muted">{body}</p>
      <Btn className="mx-auto mt-6" onClick={openSignIn}>
        {btn} →
      </Btn>
    </div>
  );
}

const STAKEHOLDERS = ["agency", "partner", "steward"];

export function StakeholderScorecard() {
  const { session } = useSession();
  const ents = useMemo(() => ENTITIES.filter((e) => !e.gov), []);
  const [entity, setEntity] = useState(ents[0].abbr);

  if (!session)
    return (
      <LockCard
        icon="lock"
        head="Stakeholder sign-in required"
        body="Weekly KPI scorecards are restricted to entity stakeholders. Sign in as a Government Agency, Infrastructure Partner or Data Steward to view your entity's performance."
        btn="Stakeholder sign-in"
      />
    );
  if (!STAKEHOLDERS.includes(session.persona))
    return (
      <LockCard
        icon="lock"
        head="Stakeholder access only"
        body={
          <>
            Your current persona (<strong>{PERSONA_BY_KEY[session.persona]?.title}</strong>) can't view
            KPI performance. Switch to a Government Agency, Infrastructure Partner or Data Steward
            persona to continue.
          </>
        }
        btn="Switch persona"
      />
    );

  const wk = isoWeek(new Date());
  const ent = ENTITIES.find((e) => e.abbr === entity)!;
  const cur = entityScore(entity, wk);
  const prev = entityScore(entity, wk - 1);
  const g = grade(cur.score);
  const delta = cur.score - prev.score;
  const nMet = cur.rows.filter((r) => r.status === "met").length;
  const nTrack = cur.rows.filter((r) => r.status === "track").length;
  const nBelow = cur.rows.filter((r) => r.status === "below").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-line-soft bg-paper shadow-card">
      <div className="flex flex-wrap items-center gap-6 border-b border-line-soft bg-paper-2 p-6">
        <div className="min-w-[230px] flex-1">
          <div className="mb-2 text-2xs uppercase tracking-wide text-ink-faint">
            Signed in as {PERSONA_BY_KEY[session.persona]?.title} · your entity
          </div>
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            aria-label="Select your entity"
            className="max-w-full border-b-2 border-brand bg-transparent py-1 pr-6 font-serif text-xl text-ink focus:outline-none"
          >
            {ents.map((e) => (
              <option key={e.abbr} value={e.abbr}>
                {e.name} ({e.abbr})
              </option>
            ))}
          </select>
          <div className="mt-2 text-sm text-ink-muted">
            Week {wk} · {ent.role}
          </div>
        </div>
        <ScoreRing score={cur.score} color={g.c} />
        <div className="flex min-w-[130px] flex-col gap-1">
          <span className="text-2xs uppercase tracking-wide text-ink-faint">Weekly grade</span>
          <span className="font-serif text-4xl leading-none" style={{ color: g.c }}>
            {g.g}
          </span>
          <span className={`text-sm font-semibold ${delta >= 0 ? "text-open" : "text-confidential"}`}>
            {delta >= 0 ? "▲ +" + delta : "▼ " + delta} pts vs last week
          </span>
        </div>
      </div>
      <div className="px-6 py-2">
        {cur.rows.map((r) => {
          const s = KPI_STAT[r.status];
          return (
            <div key={r.t} className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-2 border-b border-line-soft py-4 last:border-0">
              <div>
                <div className="font-semibold">{r.t}</div>
                <div className="mt-0.5 text-2xs text-ink-faint">
                  Target {r.better === "high" ? "≥" : "≤"} {r.target}
                  {r.unit}
                </div>
              </div>
              <div className="text-right font-serif text-lg tabular">
                {r.actual}
                {r.unit}
                <span
                  className="ml-2.5 rounded-full px-2.5 py-0.5 align-middle text-2xs font-bold"
                  style={{ color: s.c, background: s.c + "22" }}
                >
                  {s.l}
                </span>
              </div>
              <div className="col-span-2 mt-0.5 h-1.5 overflow-hidden rounded-full bg-line-soft">
                <div className="h-full rounded-full" style={{ width: r.fill + "%", background: s.c }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft bg-paper-2 px-6 py-4 text-2xs text-ink-faint">
        <span>
          {nMet} met · {nTrack} on track · {nBelow} below target
        </span>
        <span>Composite weekly score · weighted KPI attainment · governed by CRDA</span>
      </div>
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  return (
    <div
      className="relative grid h-28 w-28 flex-none place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${score}%, rgb(var(--line-soft)) 0)` }}
    >
      <div className="absolute inset-[9px] rounded-full bg-paper" />
      <span className="relative font-serif text-3xl leading-none" style={{ color }}>
        {score}
      </span>
      <span className="relative mt-1 text-2xs text-ink-faint">/ 100</span>
    </div>
  );
}

export function DecisionCockpit() {
  const { session } = useSession();
  if (!session)
    return (
      <LockCard
        icon="gauge"
        head="Leadership sign-in required"
        body="The Decision Cockpit is restricted to leadership. Sign in and choose the Leadership · CRDA persona to view city-wide oversight, the all-entity KPI leaderboard and policy signals."
        btn="Leadership sign-in"
      />
    );
  if (session.persona !== "leadership")
    return (
      <LockCard
        icon="lock"
        head="Leadership access only"
        body={
          <>
            The Decision Cockpit is for decision-makers. Your persona (
            <strong>{PERSONA_BY_KEY[session.persona]?.title}</strong>) can see operational data; switch
            to the Leadership · CRDA persona for all-entity oversight.
          </>
        }
        btn="Switch persona"
      />
    );

  const wk = isoWeek(new Date());
  const rows = ENTITIES.filter((e) => !e.gov)
    .map((e) => {
      const c = entityScore(e.abbr, wk);
      const pv = entityScore(e.abbr, wk - 1);
      return { e, score: c.score, delta: c.score - pv.score, grade: grade(c.score) };
    })
    .sort((a, b) => b.score - a.score);
  const avg = Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);
  const g = grade(avg);
  const onTrack = rows.filter((r) => r.score >= 84).length;
  const below = rows.filter((r) => r.score < 80).length;
  const active = EXCHANGES.filter((x) => x.status === "active").length;
  const review = EXCHANGES.filter((x) => x.status === "review" || x.status === "agreement").length;
  const declined = EXCHANGES.filter((x) => x.status === "denied").length;
  const top = [...rows].sort((a, b) => b.delta - a.delta)[0];
  const drop = [...rows].sort((a, b) => a.delta - b.delta)[0];

  const tiles = [
    { label: "City KPI composite", value: `${avg}`, sub: `/100 · ${g.g}`, note: "Weighted weekly score across all entities", color: g.c },
    { label: "Entities on track", value: `${onTrack}`, sub: `/${rows.length}`, note: "Grade B or better this week" },
    { label: "Active exchanges", value: `${active}`, sub: "", note: "Live government-to-government data flows" },
    { label: "Awaiting CRDA decision", value: `${review}`, sub: "", note: "Under review or pending agreement" },
  ];

  const signals: { tone: string; head: string; body: string }[] = [
    {
      tone: below > 0 ? "#e0556a" : "#0a7d63",
      head: `${below} ${below === 1 ? "entity" : "entities"} below target`,
      body:
        below > 0
          ? "Prioritise an SLA and capacity review with the lowest performers and schedule a governance check-in."
          : "All entities are at or above the weekly target — sustain the current governance posture.",
    },
    {
      tone: "#0a7d63",
      head: `Top improver · ${top.e.abbr} ▲ +${top.delta}`,
      body: `${top.e.name} posted the biggest week-over-week gain. Capture what worked and replicate it across peer entities.`,
    },
  ];
  if (drop.delta < 0)
    signals.push({
      tone: "#c96a12",
      head: `Needs attention · ${drop.e.abbr} ▼ ${drop.delta}`,
      body: `${drop.e.name} declined this week. Flag for a stewardship review before it affects dependent exchanges.`,
    });
  signals.push({
    tone: "#2563eb",
    head: `${review} exchange${review === 1 ? "" : "s"} awaiting CRDA decision`,
    body: "Review purpose, legal basis and DPDP/consent, then approve, agree or decline to keep the register moving.",
  });
  if (declined > 0)
    signals.push({
      tone: "#e0556a",
      head: `${declined} exchange${declined === 1 ? "" : "s"} declined`,
      body: "A requested exchange was declined on governance grounds — confirm the policy rationale is recorded for audit.",
    });
  signals.push({
    tone: g.c,
    head: `City KPI composite · ${avg}/100 (${g.g})`,
    body: "Use this as the headline governance indicator in the weekly leadership review and the quarterly policy note.",
  });

  return (
    <div>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-card border border-line-soft bg-paper p-5 shadow-card">
            <div className="mb-2.5 text-2xs uppercase tracking-wide text-ink-faint">{t.label}</div>
            <div className="font-serif text-3xl leading-none tabular" style={t.color ? { color: t.color } : undefined}>
              {t.value}
              {t.sub && <span className="text-sm text-ink-muted"> {t.sub}</span>}
            </div>
            <div className="mt-2 text-2xs text-ink-muted">{t.note}</div>
          </div>
        ))}
      </div>

      <div className="mb-3.5 mt-9 text-2xs uppercase tracking-wide text-ink-faint">
        Entity oversight · week {wk}
      </div>
      <div className="overflow-x-auto rounded-card border border-line-soft bg-paper">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-line-soft text-left text-2xs uppercase tracking-wide text-ink-faint">
              <th className="p-3 font-semibold">#</th>
              <th className="p-3 font-semibold">Entity</th>
              <th className="p-3 font-semibold">Weekly score</th>
              <th className="p-3 font-semibold">Grade</th>
              <th className="p-3 font-semibold">Trend</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const st = r.score >= 84 ? { l: "On track", c: "#0a7d63" } : r.score >= 80 ? { l: "Watch", c: "#c96a12" } : { l: "Below target", c: "#e0556a" };
              return (
                <tr key={r.e.abbr} className="border-b border-line-soft last:border-0 hover:bg-paper-2">
                  <td className="p-3 font-serif text-ink-faint">{i + 1}</td>
                  <td className="whitespace-nowrap p-3 font-semibold">
                    {r.e.abbr} <span className="font-normal text-ink-faint">· {r.e.name}</span>
                  </td>
                  <td className="p-3">
                    <span className="mr-2.5 inline-block h-1.5 w-28 overflow-hidden rounded-full bg-line-soft align-middle">
                      <span className="block h-full rounded-full" style={{ width: r.score + "%", background: r.grade.c }} />
                    </span>
                    <span className="font-serif tabular">{r.score}</span>
                  </td>
                  <td className="p-3 font-bold" style={{ color: r.grade.c }}>
                    {r.grade.g}
                  </td>
                  <td className="whitespace-nowrap p-3 font-semibold" style={{ color: r.delta >= 0 ? "#0a7d63" : "#e0556a" }}>
                    {r.delta >= 0 ? "▲ +" + r.delta : "▼ " + r.delta}
                  </td>
                  <td className="p-3">
                    <span className="rounded-full px-2.5 py-0.5 text-2xs font-bold" style={{ color: st.c, background: st.c + "22" }}>
                      {st.l}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mb-3.5 mt-9 text-2xs uppercase tracking-wide text-ink-faint">
        Insights & policy signals — what needs a decision
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map((s, i) => (
          <div key={i} className="rounded-card border border-line-soft bg-paper p-4 shadow-card" style={{ borderLeft: `3px solid ${s.tone}` }}>
            <div className="mb-1.5 font-semibold">{s.head}</div>
            <div className="text-sm text-ink-muted">{s.body}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-2xs text-ink-faint">
        Indicative concept data. Scores are weighted weekly KPI attainment; signals are derived for
        illustration.
      </p>
    </div>
  );
}
