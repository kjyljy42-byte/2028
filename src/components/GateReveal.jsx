import { wedding } from "../data/wedding.js";
function GateLeaf({ side }) {
  return (
    <div className={`gate-leaf gate-${side}`}>
      <div className="gate-artwork">
        <img src={wedding.images.gate} alt="" draggable="false" />
      </div>
    </div>
  );
}
export default function GateReveal() {
  return (
    <div className="gate-reveal" aria-hidden="true">
      <div className="gate-depth">
        <GateLeaf side="left" />
        <GateLeaf side="right" />
        <div className="gate-crest">В <i>&</i> Ю</div>
      </div>
    </div>
  );
}
