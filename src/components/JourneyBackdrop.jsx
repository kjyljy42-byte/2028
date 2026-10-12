import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { wedding } from "../data/wedding.js";
export default function JourneyBackdrop() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--invitation-background", `url("${wedding.images.background}")`);
    return () => root.style.removeProperty("--invitation-background");
  }, []);
  return createPortal(
    <div className="journey-world celestial-background" style={{ backgroundImage: `url(${wedding.images.background})` }} aria-hidden="true">
      <div className="celestial-shade" />
    </div>, document.body
  );
}
