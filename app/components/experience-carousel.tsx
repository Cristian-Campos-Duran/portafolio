"use client";

import { useEffect, useState } from "react";
import type { ShowcaseVisual } from "../site-data";

export function ExperienceCarousel({ slides }: { slides: ShowcaseVisual[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      3800,
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const move = (direction: number) =>
    setIndex((value) => (value + direction + slides.length) % slides.length);

  return (
    <div className="experience-carousel">
      <div className="experience-carousel-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={slides[index].src} src={slides[index].src} alt={slides[index].alt} />
        <div className="experience-carousel-status">
          <span>Muestra de trabajo</span>
          <strong>{String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</strong>
        </div>
      </div>
      <div className="experience-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Trabajo anterior">←</button>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Reanudar carrusel" : "Pausar carrusel"}>
          {paused ? "Reanudar" : "Pausar"}
        </button>
        <button type="button" onClick={() => move(1)} aria-label="Trabajo siguiente">→</button>
      </div>
    </div>
  );
}
