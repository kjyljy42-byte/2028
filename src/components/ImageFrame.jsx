import { useState } from "react";
import { wedding } from "../data/wedding.js";
import { MedievalFrame } from "./Decorations.jsx";
// Only request real photos when they exist. Missing photos use authored engravings.
const photos = import.meta.glob("/public/assets/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});
export default function ImageFrame({ imageKey, alt, className = "" }) {
  const actual = photos["/public" + wedding.images[imageKey]];
  const [failed, setFailed] = useState(false);
  const placeholder = !actual || failed;
  return (
    <figure className={`image-frame ${className}`}>
      <MedievalFrame>
        <img
          src={placeholder ? wedding.placeholders[imageKey] : actual}
          alt={alt}
          loading="lazy"
          width="800"
          height="500"
          onError={() => setFailed(true)}
        />
      </MedievalFrame>
      {placeholder && (
        <figcaption>Временная иллюстрация · здесь будет фотография</figcaption>
      )}
    </figure>
  );
}
