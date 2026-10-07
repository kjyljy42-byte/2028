import { useEffect, useState } from "react";
import { wedding } from "../data/wedding.js";
import { Ornament } from "./Decorations.jsx";
const KEY = "wedding-invitation-opened";
export function hasOpened() {
  try {
    return sessionStorage.getItem(KEY) === "yes";
  } catch {
    return false;
  }
}
export default function Opening({ onOpen }) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [ready, setReady] = useState(reduced);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(
      () => setReady(true),
      reduced ? 0 : wedding.openingDuration,
    );
    return () => {
      document.body.style.overflow = previous;
      clearTimeout(timer);
    };
  }, [reduced]);
  function open() {
    if (leaving) return;
    try {
      sessionStorage.setItem(KEY, "yes");
    } catch {
      /* Storage is optional. */
    }
    setLeaving(true);
    setTimeout(onOpen, reduced ? 150 : 1000);
  }
  return (
    <div
      className={`opening ${ready ? "ready" : ""} ${leaving ? "leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
    >
      <div className="opening-sky" />
      <div className="opening-stars">
        <img src="/assets/stars.svg" alt="" />
        <img className="moon" src="/assets/moon.svg" alt="" />
      </div>
      <div className="cloud cloud-one" />
      <div className="cloud cloud-two" />
      <div className="opening-top">
        <span>СВАДЕБНАЯ ХРОНИКА</span>
        <Ornament type="crown" />
        <h1 id="opening-title">Однажды, в одном королевстве…</h1>
      </div>
      <div className="castle-scene">
        <img
          className="castle"
          src="/assets/castle-opening.svg"
          alt="Старинный замок. Принц и принцесса встречаются в окне башни."
        />
        <div className="window-light" />
        <img className="prince" src="/assets/prince.svg" alt="" />
        <img className="princess" src="/assets/princess.svg" alt="" />
        <div className="gold-particles" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </div>
        <div className="kiss-spark" aria-hidden="true">
          ✧
        </div>
      </div>
      <div className="opening-bottom">
        <p>{wedding.names}</p>
        <span>XXII · VI · MMXXVIII</span>
        <button
          className="open-invitation"
          onClick={open}
          disabled={!ready || leaving}
          autoFocus={reduced}
        >
          Открыть приглашение <span aria-hidden="true">↗</span>
        </button>
        <p className="opening-caption" aria-live="polite">
          {ready
            ? "Ваша история начинается здесь"
            : "У каждой любви есть своя сказка"}
        </p>
      </div>
      {!ready && (
        <button className="skip-opening" onClick={() => setReady(true)}>
          Пропустить историю
        </button>
      )}
    </div>
  );
}
