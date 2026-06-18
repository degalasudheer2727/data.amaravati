/**
 * The mandatory "concept / not official / not endorsed" disclaimer.
 * Required in the website footer and the app profile screen — do not soften.
 */
export function Disclaimer({ variant = "platform" }: { variant?: "platform" | "visit" }) {
  return (
    <div className="border-t border-line-soft bg-paper-2">
      <div className="wrap py-6 text-2xs leading-relaxed text-ink-faint">
        <p>
          <strong className="text-ink-muted">Concept prototype — not an official product.</strong>{" "}
          {variant === "visit" ? (
            <>
              Visit Amaravati is an independent concept inspired by the public Amaravati master plan
              and Andhra Pradesh's heritage. It is <strong className="text-ink-muted">not</strong> a
              Government of Andhra Pradesh or APCRDA product and is not endorsed by either. It uses no
              official State Emblem or copyrighted master-plan artwork; all illustrations are original
              abstract impressions and all figures are indicative.
            </>
          ) : (
            <>
              data.amaravati is an independent concept inspired by the public Amaravati master plan and
              the spirit of CRDA's data-governance vision. It is{" "}
              <strong className="text-ink-muted">not</strong> a Government of Andhra Pradesh or APCRDA
              product and is not endorsed by either. It deliberately does not use the official State
              Emblem or any copyrighted master-plan artwork. The 3D model is an original interpretation
              of the publicly documented city layout. All datasets shown are illustrative samples and
              all headline figures are indicative.
            </>
          )}{" "}
          © 2026 data.amaravati concept.
        </p>
      </div>
    </div>
  );
}
