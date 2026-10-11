import { useEffect, useRef, useState } from "react";
import { wedding } from "../data/wedding.js";
export default function DragonDate() {
  const [phase, setPhase] = useState("idle");
  const video = useRef(null);
  const date = useRef(null);
  const timer = useRef(null);
  const done = phase === "done";
  function finish() {
    clearTimeout(timer.current);
    video.current?.pause();
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
    setPhase("playing");
    timer.current = setTimeout(exit, 8500);
    video.current?.play().catch(finish);
  }
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
        <video ref={video} className="dragon-film" src={wedding.dragon.video} poster={wedding.dragon.poster} muted playsInline preload="auto" onEnded={exit} onError={finish} aria-hidden="true" />
      </button>}
      {phase === "idle" && <p className="dragon-hint">Хранитель бережёт нашу дату.<br/><span>Коснитесь дракона — он откроет её вам.</span></p>}
      {(phase === "playing" || phase === "exiting") && <p className="sr-only" role="status">Дракон открывает дату приглашения.</p>}
    </div>
  );
}
