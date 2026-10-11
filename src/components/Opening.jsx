import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { wedding } from "../data/wedding.js";
const KEY = "wedding-invitation-opened";
export function hasOpened() {
  try {
    return sessionStorage.getItem(KEY) === "yes";
  } catch {
    return false;
  }
}
export default function Opening({ onOpen, onBeginOpen }) {
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
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute("data-opening");
    const theme = document.querySelector('meta[name="theme-color"]');
    const previousTheme = theme?.getAttribute("content");
    root.setAttribute("data-opening", "true");
    theme?.setAttribute("content", "#101a28");
    return () => {
      if (previous === null) root.removeAttribute("data-opening");
      else root.setAttribute("data-opening", previous);
      if (previousTheme !== null && previousTheme !== undefined)
        theme?.setAttribute("content", previousTheme);
    };
  }, []);
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
    onBeginOpen?.(!reduced);
    transition.current = setTimeout(onOpen, reduced ? 150 : 3200);
  }
  async function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (video.current) {
      video.current.muted = next;
      if (!next && video.current.paused) {
        if (video.current.ended) {
          video.current.currentTime = 0;
          setReady(false);
        }
        await play();
      }
    }
  }
  async function play() {
    try {
      await video.current?.play();
      setNeedsPlay(false);
    } catch {
      setNeedsPlay(true);
    }
  }
  return (
    <div
      className={`opening opening-video ${ready ? "ready" : ""} ${leaving ? "leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="opening-title"
    >
      <h1 id="opening-title" className="sr-only">
        Свадебное приглашение — {wedding.names}
      </h1>
      <img src={wedding.images.background} alt="" hidden />
      <img src={wedding.images.gate} alt="" hidden />
      <div className="film-stage">
        {reduced || failed ? (
          <img
            className="film-poster"
            src={wedding.opening.poster}
            alt="Старинный замок с освещёнными окнами под звёздным небом"
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
            aria-label="Ночной средневековый замок среди гор и тумана."
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
      {ready && (
        <>
          <span className="invitation-meteor" aria-hidden="true" />
          <div className="star-arrival" aria-live="polite">
            <button
              className="star-invitation"
              onClick={open}
              disabled={leaving}
            >
              <span className="star-monogram-reveal" aria-hidden="true">
                <span className="monogram-v">В</span>
                <span className="monogram-amp">&amp;</span>
                <span className="monogram-y">Ю</span>
              </span>
              <svg
                className="monogram-rule"
                viewBox="0 0 180 24"
                aria-hidden="true"
              >
                <path
                  d="M9 12h61m40 0h61M70 12q-15-15-25-2m65 2q15-15 25-2m-45-7 9 9-9 9-9-9Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth=".8"
                />
              </svg>
              <span className="star-caption">Открыть приглашение</span>
            </button>
            {failed && (
              <p className="film-fallback-note">
                Видео не загрузилось. Приглашение доступно.
              </p>
            )}
          </div>
        </>
      )}
      {!ready && (
        <div className="film-playback-controls">
          {needsPlay ? (
            <button className="film-play" type="button" onClick={play}>
              Воспроизвести видео
            </button>
          ) : wedding.opening.hasAudio ? (
            <button
              className="film-sound"
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              aria-label={muted ? "Включить звук" : "Выключить звук"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 9h4l5-4v14l-5-4H4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                {muted ? (
                  <path
                    d="m17 9 5 6m0-6-5 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                ) : (
                  <path
                    d="M17 8q5 4 0 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                )}
              </svg>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
