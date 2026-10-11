import { wedding } from "../data/wedding.js";
const stars = [[7,12],[89,9],[14,33],[94,42],[6,61],[86,68],[17,87],[93,91]];
export default function JourneyBackdrop() {
  return (
    <div className="journey-world celestial-background" style={{ backgroundImage: `url(${wedding.images.background})` }} aria-hidden="true">
      <div className="celestial-shade" />
      <div className="celestial-stars">
        {stars.map(([x,y],i) => <i key={i} style={{ left:`${x}%`, top:`${y}%`, "--delay":`${i * -.9}s` }} />)}
      </div>
    </div>
  );
}
