import { useEffect, useRef, useState } from "react";
import Opening, { hasOpened } from "./components/Opening.jsx";
import Invitation from "./sections/Invitation.jsx";
export default function App() {
  const [opened, setOpened] = useState(hasOpened);
  const content = useRef(null);
  useEffect(() => {
    if (!opened) return;
    document.querySelector("#invitation")?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04 },
    );
    document.querySelectorAll(".manuscript-section").forEach((section) => {
      section.classList.add("scroll-reveal");
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, [opened]);
  return (
    <>
      <div
        ref={content}
        inert={!opened}
        aria-hidden={!opened}
        className={
          opened ? "invitation-content revealed" : "invitation-content"
        }
      >
        <Invitation />
      </div>
      {!opened && <Opening onOpen={() => setOpened(true)} />}
    </>
  );
}
