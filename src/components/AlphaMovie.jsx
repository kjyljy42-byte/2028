import { forwardRef, useEffect, useRef } from "react";
// Composite black-backed footage with real alpha, so foreground scales cover the date.
const AlphaMovie = forwardRef(function AlphaMovie(props, forwardedRef) {
  const node = useRef(null);
  const canvas = useRef(null);
  useEffect(() => {
    const film = node.current;
    const surface = canvas.current;
    const context = surface.getContext("2d", { willReadFrequently: true });
    let frame;
    let stopped = false;
    function draw(source) {
      if (stopped || !context) return;
      const width = source.videoWidth || source.naturalWidth;
      const height = source.videoHeight || source.naturalHeight;
      if (!width || !height) return;
      const targetHeight = Math.round(640 * height / width);
      if (surface.width !== 640 || surface.height !== targetHeight) {
        surface.width = 640;
        surface.height = targetHeight;
      }
      context.drawImage(source, 0, 0, surface.width, surface.height);
      const pixels = context.getImageData(0, 0, surface.width, surface.height);
      const data = pixels.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.max(data[i], data[i + 1], data[i + 2]);
        data[i + 3] = value < 28 ? 0 : value < 70 ? Math.round((value - 28) * 255 / 42) : 255;
      }
      context.putImageData(pixels, 0, 0);
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
