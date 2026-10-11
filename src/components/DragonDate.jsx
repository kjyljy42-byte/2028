import { useEffect, useRef, useState } from "react";
import { wedding } from "../data/wedding.js";
export default function DragonDate() {
  const [phase, setPhase] = useState("idle");
  const video = useRef(null);
  const idleVideo = useRef(null);
  const [idleReady, setIdleReady] = useState(false);
  const date = useRef(null);
  const timer = useRef(null);
  const done = phase === "done";
  function finish() {
    clearTimeout(timer.current);
    video.current?.pause();
    idleVideo.current?.pause();
    setPhase("done");
  }
  function exit() {
    clearTimeout(timer.current);
    video.current?.pause();
    setPhase("exiting");
    timer.current = setTimeout(finish, 850);
  }
  function reveal() {
    if (phase !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    idleVideo.current?.pause();
    setPhase("playing");
    timer.current = setTimeout(exit, 8500);
    video.current?.play().catch(finish);
  }
  useEffect(() => {
    const node = idleVideo.current;
    if (!node || phase !== "idle") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let active = true;
    function update() {
      if (visible && !preference.matches && !document.hidden) {
        node.play().catch(() => { if (active) setIdleReady(false); });
      } else node.pause();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
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
  useEffect(() => {
    if (done) date.current?.focus({ preventScroll: true });
  }, [done]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className={`dragon-date video-dragon dragon-${phase}`}>
      <div ref={date} id="guarded-date" className="guarded-date" hidden={!done} role="status" tabIndex={-1}>
        <span>День нашего свадебного пира</span>
        <strong>{wedding.dateNumeric}</strong>
        <span>{wedding.dateLabel} · {wedding.timeLabel}</span>
      </div>
      {!done && <button type="button" className="dragon-guardian" onClick={reveal} disabled={phase !== "idle"} aria-expanded="false" aria-controls="guarded-date" aria-label="Попросить дракона открыть дату свадьбы">
        <img className="dragon-resting" src={wedding.dragon.poster} alt="" />
        <video ref={idleVideo} className={`dragon-idle-film ${idleReady ? "is-playing" : ""}`} src={wedding.dragon.idleVideo} poster={wedding.dragon.poster} muted playsInline loop preload="auto" onPlaying={() => setIdleReady(true)} onError={() => setIdleReady(false)} aria-hidden="true" />
        <video ref={video} className="dragon-film" src={wedding.dragon.video} poster={wedding.dragon.poster} muted playsInline preload="auto" onEnded={exit} onError={finish} aria-hidden="true" />
      </button>}
      {phase === "idle" && <p className="dragon-hint">Хранитель бережёт нашу дату.<br/><span>Коснитесь дракона — он откроет её вам.</span></p>}
      {(phase === "playing" || phase === "exiting") && <p className="sr-only" role="status">Дракон открывает дату приглашения.</p>}
    </div>
  );
}
