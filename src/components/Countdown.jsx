import { useEffect, useState } from "react";
import { wedding } from "../data/wedding.js";
import { getCountdown } from "../utils/countdown.js";
export default function Countdown() {
  const [remaining, setRemaining] = useState(() =>
    getCountdown(wedding.startsAt),
  );
  useEffect(() => {
    const timer = setInterval(
      () => setRemaining(getCountdown(wedding.startsAt)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  if (remaining.total === 0) return <p className="today">Сегодня!</p>;
  return (
    <div
      className="countdown"
      role="timer"
      aria-label="Время до свадебного пира"
    >
      {[
        ["days", "дней"],
        ["hours", "часов"],
        ["minutes", "минут"],
        ["seconds", "секунд"],
      ].map(([key, label]) => (
        <div className="countdown-part" key={key}>
          <span data-count={key}>
            {String(remaining[key]).padStart(2, "0")}
          </span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
