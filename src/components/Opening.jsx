import { useEffect, useRef, useState } from "react";
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
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [ready, setReady] = useState(reduced);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);
  const [needsPlay, setNeedsPlay] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef(null);
  const transition = useRef(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(preference.matches);
      if (preference.matches) setReady(true);
    };
    preference.addEventListener("change", update);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      preference.removeEventListener("change", update);
      clearTimeout(transition.current);
    };
  }, []);
  useEffect(() => {
    if (reduced || failed || !video.current) return;
    let active = true;
    video.current.play().catch(() => {
      if (active) {
        setNeedsPlay(true);
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [reduced, failed]);
  function open() {
    if (leaving) return;
    video.current?.pause();
    try {
      sessionStorage.setItem(KEY, "yes");
    } catch {
      /* Storage is optional. */
    }
    setLeaving(true);
    transition.current = setTimeout(onOpen, reduced ? 150 : 900);
  }
  async function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (video.current) {
      video.current.muted = next;
      if (!next && video.current.paused) {
        if (video.current.ended) video.current.currentTime = 0;
        await play();
      }
    }
  }
  async function play() {
    try {
      await video.current?.play();
      setNeedsPlay(false);
    } catch {
      setReady(true);
    }
  }
  return (
    <div
      className={`opening opening-video ${ready ? "ready" : ""} ${leaving ? "leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
    >
      <header className="film-heading">
        <Ornament type="crown" />
        <p>СВАДЕБНАЯ ХРОНИКА</p>
        <h1 id="opening-title">У каждой любви есть своя сказка</h1>
      </header>
      <div className="film-stage">
        {reduced || failed ? (
          <img
            className="film-poster"
            src={wedding.opening.poster}
            alt="Принц и принцесса целуются на балконе замка под звёздным небом"
          />
        ) : (
          <video
            ref={video}
            className="film-video"
            src={wedding.opening.video}
            poster={wedding.opening.poster}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            aria-label="Принц и принцесса встречаются и целуются на балконе замка. День сменяется звёздной ночью."
            onEnded={() => {
              setReady(true);
              setNeedsPlay(false);
            }}
            onError={() => {
              setFailed(true);
              setReady(true);
            }}
          />
        )}
      </div>
      <footer className="film-footer">
        <p className="film-names">{wedding.names}</p>
        <p className="film-date">22 ИЮНЯ 2028</p>
        <div className="film-action" aria-live="polite">
          {ready ? (
            <button className="film-open" onClick={open} disabled={leaving}>
              Открыть приглашение <span aria-hidden="true">✧</span>
            </button>
          ) : (
            <button
              className="film-skip"
              onClick={() => {
                video.current?.pause();
                setReady(true);
              }}
            >
              Пропустить историю →
            </button>
          )}
        </div>
        <div className="film-controls">
          {!reduced && !failed && (
            <button type="button" onClick={toggleSound} aria-pressed={!muted}>
              {muted ? "Включить звук" : "Выключить звук"}
            </button>
          )}
          {needsPlay && !reduced && !failed && (
            <button type="button" onClick={play}>
              Воспроизвести видео
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
