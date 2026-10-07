import { useEffect, useRef, useState } from "react";
import { wedding } from "../data/wedding.js";
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
      {ready && (
        <div className="dove-arrival" aria-live="polite">
          <button className="dove-invitation" onClick={open} disabled={leaving}>
            <svg
              className="invitation-dove"
              viewBox="0 0 180 120"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="dove-feathers" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#e9e7df" />
                </linearGradient>
              </defs>
              <path
                d="M94 75C71 71 57 55 51 39 44 22 32 13 17 10 24 30 34 43 45 52 29 44 16 36 6 35 16 54 35 66 54 70 40 69 28 66 16 63 30 78 48 82 68 82L49 101 75 93 66 111 91 90C109 89 121 82 128 70L141 60 156 61 147 53C147 43 138 37 130 42L119 51C112 52 107 47 101 35 92 18 78 8 62 4 66 25 77 39 89 49 80 46 71 39 63 30 67 52 78 65 94 75Z"
                fill="url(#dove-feathers)"
                stroke="#fff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M24 24Q39 53 66 66M20 45Q45 67 71 71M74 19Q83 44 102 59M76 43Q86 62 108 70M79 81l-15 13"
                fill="none"
                stroke="#c8cbd1"
                strokeWidth="1.1"
              />
              <circle cx="137" cy="49" r="1.5" fill="#536077" />
              <path
                d="M144 60q-11 13-11 25m1-8q-12-1-13 6 11 2 13-6m-1 7q10-1 11 5-10 1-11-5"
                fill="none"
                stroke="#f5f0df"
                strokeWidth="1.4"
              />
            </svg>
            <span>Открыть приглашение</span>
          </button>
          {failed && (
            <p className="film-fallback-note">
              Видео не загрузилось. Приглашение доступно.
            </p>
          )}
        </div>
      )}
      {!ready && (
        <div className="film-playback-controls">
          {needsPlay ? (
            <button className="film-play" type="button" onClick={play}>
              Воспроизвести видео
            </button>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
