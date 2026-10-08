import SceneBackground, { sceneFor } from "./SceneBackground.jsx";
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
export function Section({ number, title, children, className = "", id }) {
  return (
    <section
      id={id}
      data-section={number}
      className={`manuscript-section ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <SceneBackground scene={sceneFor(id)} />
      <div className="section-inner">
        <p className="chapter" aria-hidden="true">
          {number} · СВАДЕБНАЯ ХРОНИКА
        </p>
        {title && <h2 id={`${id}-title`}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}
