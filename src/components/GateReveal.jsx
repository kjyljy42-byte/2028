import { useId } from "react";
import { wedding } from "../data/wedding.js";
function GateLeaf({ side }) {
  const id = useId();
  return <div className={`gate-leaf gate-${side}`}><svg viewBox="0 0 240 800" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id={id} x2="1" y2="0"><stop stopColor="#242c31"/><stop offset=".4" stopColor="#a68b55"/><stop offset=".55" stopColor="#3b4241"/><stop offset="1" stopColor="#101c23"/></linearGradient></defs>
    <g fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinejoin="round">
      <path d="M8 792V150Q120 55 232 30V792ZM8 650H232M8 705H232M8 300Q120 225 232 225"/>
      {[40,80,120,160,200].map((x,i)=><g key={x}><path d={`M${x} 790V${145-i*20}`}/><path d={`M${x-6} ${155-i*20}l6-20 6 20`} fill="#9d8656"/><path d={`M${x} 630q-28-35-28-62q0-22 16-22q18 0 9 19M${x} 630q28-35 28-62q0-22-16-22q-18 0-9 19`} strokeWidth="2"/></g>)}
      <path d="M20 450Q90 310 205 325Q150 335 147 380Q140 418 106 400Q77 377 101 355M20 450Q100 525 207 440Q148 473 136 435Q112 397 83 430Q70 456 98 460" strokeWidth="3"/>
      <path d="M25 747q55-64 100 0q45-64 95 0M40 275q35-85 70-25q35-85 78-25" strokeWidth="2"/>
    </g>
    <g fill="#af9861"><circle cx="230" cy="466" r="5"/><path d="m120 305 5 10-5 10-5-10z"/></g>
  </svg></div>;
}
export default function GateReveal() {
  return <div className="gate-reveal" aria-hidden="true">
    <img className="gate-landscape" src={wedding.images.terrace} alt=""/>
    <div className="gate-depth"><GateLeaf side="left"/><GateLeaf side="right"/><div className="gate-crest">В <i>&</i> Ю</div></div>
    <div className="gate-welcome"><span>Добро пожаловать в нашу историю</span></div>
  </div>;
}
