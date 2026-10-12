import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { wedding } from "../data/wedding.js";
export default function JourneyBackdrop() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--invitation-background", `url("${wedding.images.background}")`);
    let previousWidth = 0;
    function size() {
      const width = root.clientWidth;
      if (width === previousWidth) return; // Safari toolbar changes must not resize the sky.
      previousWidth = width;
      const layer = document.querySelector(".journey-world");
      const height = layer?.getBoundingClientRect().height || window.innerHeight;
      root.style.setProperty("--sky-cover-width", `${Math.max(width, height * 2 / 3)}px`);
      root.style.setProperty("--sky-cover-height", `${Math.max(height, width * 3 / 2)}px`);
    }
    size();
    window.addEventListener("resize", size);
    return () => {
      window.removeEventListener("resize", size);
      ["--invitation-background", "--sky-cover-width", "--sky-cover-height"].forEach(name => root.style.removeProperty(name));
    };
  }, []);
  return createPortal(
    <div className="journey-world celestial-background" style={{ backgroundImage: `url(${wedding.images.background})` }} aria-hidden="true">
      <img className="sky-image" src={wedding.images.background} alt="" width="1024" height="1536" decoding="sync" />
      <div className="celestial-shade" />
    </div>, document.body
  );
}
