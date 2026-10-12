import { createDragonRenderer } from "../utils/dragonRenderer.js";
import { forwardRef, useEffect, useRef } from "react";
// Composite black-backed footage with real alpha, so foreground scales cover the date.
const AlphaMovie = forwardRef(function AlphaMovie(props, forwardedRef) {
  const node = useRef(null);
  const canvas = useRef(null);
  useEffect(() => {
    const film = node.current;
    const surface = canvas.current;
    const renderer = createDragonRenderer(surface);
    let frame;
    let stopped = false;
    function draw(source) {
      if (stopped) return;
      const width = source.videoWidth || source.naturalWidth;
      const height = source.videoHeight || source.naturalHeight;
      if (!width || !height) return;
      const resolution = Math.min(width, renderer.resolution);
      renderer.draw(source,resolution,Math.round(resolution * height / width));
    }
    function tick() {
      draw(film);
      if (!film.paused && !film.ended && !stopped) {
        frame = film.requestVideoFrameCallback ? film.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
      }
    }
    function cancel() {
      if (frame === undefined) return;
      if (film.cancelVideoFrameCallback) film.cancelVideoFrameCallback(frame);
      else cancelAnimationFrame(frame);
      frame = undefined;
    }
    function start() { cancel(); tick(); }
    function loaded() { draw(film); }
    const poster = new Image();
    poster.onload = () => { if (film.readyState < 2) draw(poster); };
    if (props.poster) poster.src = props.poster;
    film.addEventListener("loadeddata", loaded);
    film.addEventListener("playing", start);
    film.addEventListener("pause", cancel);
    film.addEventListener("ended", loaded);
    if (film.readyState >= 2) loaded();
    if (!film.paused) start();
    return () => {
      stopped = true;
      cancel();
      renderer.dispose();
      film.removeEventListener("loadeddata", loaded);
      film.removeEventListener("playing", start);
      film.removeEventListener("pause", cancel);
      film.removeEventListener("ended", loaded);
    };
  }, [props.src, props.poster]);
  return <>
    <video {...props} ref={element => { node.current = element; if (typeof forwardedRef === "function") forwardedRef(element); else if (forwardedRef) forwardedRef.current = element; }} style={{ opacity: 0 }} />
    <canvas ref={canvas} className={`${props.className || ""} alpha-canvas`} aria-hidden="true" />
  </>;
});
export default AlphaMovie;
