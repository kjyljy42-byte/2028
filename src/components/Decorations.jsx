export function Ornament({ type = "flourish", className = "" }) {
  return (
    <svg
      className={`ornament ${className}`}
      viewBox="0 0 200 50"
      fill="none"
      aria-hidden="true"
    >
      {type === "crown" ? (
        <>
          <path d="M65 33 58 13l25 11L100 6l17 18 25-11-7 20Z" />
          <path d="M67 39h66M76 33l-4-11m52 11 4-11" />
          <circle cx="100" cy="29" r="3" />
        </>
      ) : (
        <>
          <path d="M10 26h60m60 0h60M64 26q-29-31-43-6 20-12 27 6-7 18-27 6 14 25 43-6m72 0q29-31 43-6-20-12-27 6 7 18 27 6-14 25-43-6" />
          <path d="m100 12 14 14-14 14-14-14z" />
          <circle cx="100" cy="26" r="3" />
        </>
      )}
    </svg>
  );
}
export function Divider({ light = false }) {
  return (
    <div className={`divider ${light ? "light" : ""}`}>
      <Ornament />
    </div>
  );
}
export function MedievalFrame({ children, className = "" }) {
  return (
    <div className={`medieval-frame ${className}`}>
      <span className="corner tl" aria-hidden="true">
        ✧
      </span>
      <span className="corner tr" aria-hidden="true">
        ✧
      </span>
      {children}
      <span className="corner bl" aria-hidden="true">
        ✧
      </span>
      <span className="corner br" aria-hidden="true">
        ✧
      </span>
    </div>
  );
}
export function MedievalButton({ children, className = "", ...props }) {
  return (
    <button className={`medieval-button ${className}`} {...props}>
      <span>{children}</span>
      <span aria-hidden="true">✧</span>
    </button>
  );
}
function ParchmentEdge({ side }) {
  return (
    <svg className={`parchment-edge parchment-edge-${side}`} viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0H1440V24C1350 12 1320 39 1210 30S1050 15 950 32S810 49 710 30S560 14 450 33S310 44 210 27S75 13 0 29Z" />
    </svg>
  );
}
export function Section({ number, title, children, className = "", id, parchmentEdges = false }) {
  return (
    <section
      id={id}
      data-section={number}
      className={`manuscript-section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      {parchmentEdges && <ParchmentEdge side="top" />}
      <div className="chapter-separator" aria-hidden="true">
        <span /><Ornament /><span />
      </div>
      <div className="section-inner">
        {title && <h2 id={`${id}-title`}>{title}</h2>}
        {children}
      </div>
      {parchmentEdges && <ParchmentEdge side="bottom" />}
    </section>
  );
}
