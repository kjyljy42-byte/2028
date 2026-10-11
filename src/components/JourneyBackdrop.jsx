import { useEffect, useState } from "react";
import SceneBackground from "./SceneBackground.jsx";
const chapters = { hero: "night", greeting: "night", countdown: "night", venue: "courtyard", calendar: "courtyard", dress: "courtyard", gifts: "hall", overnight: "hall", transfer: "hall", children: "hall", food: "hall", drinks: "hall", final: "balcony" };
export default function JourneyBackdrop() {
  const [scene, setScene] = useState("night");
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setScene(chapters[entry.target.id] || "night");
    }, { rootMargin: "-30% 0px -45% 0px", threshold: 0 });
    document.querySelectorAll("[data-section]").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <div className={`journey-world journey-${scene}`} aria-hidden="true">
    {["night", "courtyard", "hall", "balcony"].map(name => <div className={`journey-layer ${scene === name ? "current" : ""}`} key={name}><SceneBackground scene={name} /></div>)}
    <div className="journey-mist" />
    <div className="castle-gates"><span /><span /></div>
  </div>;
}
