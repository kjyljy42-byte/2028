import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { wedding } from "../data/wedding.js";
const stars = [[7,12],[89,9],[14,33],[94,42],[6,61],[86,68],[17,87],[93,91]];
export default function JourneyBackdrop() {
  const [reading, setReading] = useState(false);
  useEffect(() => {
    const hero = document.querySelector("#hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setReading(!entry.isIntersecting), { rootMargin: "-20% 0px -60% 0px" });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  return createPortal(
    <div className={`journey-world celestial-background ${reading ? "is-reading" : ""}`} style={{ backgroundImage: `url(${wedding.images.background})` }} aria-hidden="true">
      <div className="celestial-shade" />
      <div className="celestial-reading-shade" />
      <div className="celestial-stars">
        {stars.map(([x,y],i) => <i key={i} style={{ left:`${x}%`, top:`${y}%`, "--delay":`${i * -.9}s` }} />)}
      </div>
    </div>, document.body
  );
}
