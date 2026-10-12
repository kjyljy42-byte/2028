import { useEffect, useId, useRef, useState } from "react";
import AlphaMovie from "./AlphaMovie.jsx";
import { wedding } from "../data/wedding.js";
export default function DragonDate() {
  const contour = useId();
  const [phase, setPhase] = useState("idle");
  const [idleReady, setIdleReady] = useState(false);
  const video = useRef(null);
  const returning = useRef(null);
  const idleVideo = useRef(null);
  const settledIdle = useRef(null);
  const [settledReady, setSettledReady] = useState(false);
  const [fading, setFading] = useState(false);
  const date = useRef(null);
  const timer = useRef(null);
  const revealed = phase === "returning" || phase === "settled";
  function finish() {
    clearTimeout(timer.current);
    video.current?.pause();
    idleVideo.current?.pause();
    returning.current?.pause();
    setPhase("settled");
  }
  function returnDragon() {
    clearTimeout(timer.current);
    setPhase("returning");
    timer.current = setTimeout(finish, 8500);
    returning.current?.play().catch(finish);
  }
  function exit() {
    clearTimeout(timer.current);
    video.current?.pause();
    returnDragon();
  }
  function reveal() {
    if (phase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return finish();
    idleVideo.current?.pause();
    setPhase("playing");
    timer.current = setTimeout(exit, 8500);
    video.current?.play().catch(finish);
  }
  useEffect(() => {
    const node = phase === "settled" ? settledIdle.current : idleVideo.current;
    if (!node || (phase !== "idle" && phase !== "settled")) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let active = true;
    function update() {
      if (visible && !preference.matches && !document.hidden) {
        node.play().catch(() => { if (active) (phase === "settled" ? setSettledReady : setIdleReady)(false); });
      } else node.pause();
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(node);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      active = false;
      node.pause();
      observer.disconnect();
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [phase]);
  useEffect(() => { if (revealed) date.current?.focus({ preventScroll: true }); }, [revealed]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className={`dragon-date video-dragon dragon-${phase}`}>
      <p className="dragon-date-heading">День нашей свадьбы</p>
      <div ref={date} id="guarded-date" className="guarded-date" role="status" tabIndex={-1}>
        <strong>{wedding.dateNumeric}</strong>
        <span className="wedding-hour">{wedding.timeLabel}</span>
      </div>
      {!revealed && <button type="button" className="dragon-guardian" onClick={reveal} disabled={phase !== "idle"} aria-expanded="false" aria-controls="guarded-date" aria-label="Попросить дракона открыть дату свадьбы">
        <img className="dragon-resting" src={wedding.dragon.poster} alt="" />
        <AlphaMovie ref={idleVideo} className={`dragon-idle-film ${idleReady ? "is-playing" : ""}`} src={wedding.dragon.idleVideo} poster={wedding.dragon.poster} muted playsInline loop preload="auto" onPlaying={() => setIdleReady(true)} onError={() => setIdleReady(false)} aria-hidden="true" />
        <AlphaMovie ref={video} className={`dragon-film ${fading ? "dragon-film-fading" : ""}`} src={wedding.dragon.video} poster={wedding.dragon.poster} muted playsInline preload="auto" onEnded={exit} onTimeUpdate={(event) => { const node = event.currentTarget; if (phase === "playing" && node.duration - node.currentTime <= .25) setFading(true); }} onError={() => { if (phase === "playing") finish(); }} aria-hidden="true" />
      </button>}
      <div className="dragon-return-layer" aria-hidden="true">
        <AlphaMovie ref={returning} className="dragon-return-film" poster={wedding.dragon.settledPoster} src={wedding.dragon.returnVideo} muted playsInline preload="auto" onEnded={finish} onError={() => { if (phase === "returning") finish(); }} />
        <AlphaMovie ref={settledIdle} className={`dragon-settled-idle ${settledReady ? "is-playing" : ""}`} src={wedding.dragon.idleVideo} poster={wedding.dragon.poster} muted playsInline loop preload="auto" onPlaying={() => setSettledReady(true)} onError={() => setSettledReady(false)} />
      </div>
      {phase === "idle" && <button type="button" className="dragon-tap-prompt dragon-contour-prompt" onClick={reveal} aria-controls="guarded-date" aria-label="Нажми на дракона, чтобы узнать дату">
        <svg viewBox="0 0 480 150" aria-hidden="true">
          <defs><path id={contour} d="M14 130 C54 5 205 5 285 44 S404 82 465 138" /></defs>
          <text><textPath href={`#${contour}`} startOffset="50%" textAnchor="middle">Нажми на дракона, чтобы узнать дату</textPath></text>
        </svg>
      </button>}
      {(phase === "playing" || phase === "exiting") && <p className="sr-only" role="status">Дракон открывает дату приглашения.</p>}
    </div>
  );
}
