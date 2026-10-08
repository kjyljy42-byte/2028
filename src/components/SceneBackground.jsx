import { useEffect, useRef } from "react";
export default function SceneBackground({ scene = "night" }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => node.classList.toggle("is-active", entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(node.parentElement);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`scene-background scene-${scene}`}
      aria-hidden="true"
    >
      <div className="scene-clouds" />
      <div className="scene-stars">
        {[
          [5, 12],
          [94, 9],
          [10, 34],
          [90, 41],
          [3, 66],
          [97, 72],
          [15, 7],
          [84, 84],
        ].map(([x, y], i) => (
          <i
            key={i}
            style={{ left: `${x}%`, top: `${y}%`, "--delay": `${i * -0.8}s` }}
          />
        ))}
      </div>
      {scene !== "hall" && <span className="scene-meteor" />}
      {scene === "hall" && (
        <>
          <div className="scene-candle candle-left">
            <i />
          </div>
          <div className="scene-candle candle-right">
            <i />
          </div>
          <div className="scene-embers">
            {Array.from({ length: 4 }, (_, i) => (
              <i
                key={i}
                style={{ "--delay": `${i * -2}s`, left: i % 2 ? "96%" : "4%" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export function sceneFor(id) {
  return [
    "gifts",
    "overnight",
    "transfer",
    "children",
    "food",
    "drinks",
  ].includes(id)
    ? "hall"
    : id === "final"
      ? "balcony"
      : "night";
}
