"use client";

import { useEffect, useState } from "react";
import { navigation } from "../site-data";

export function SceneObserver() {
  const [activeId, setActiveId] = useState("proyectos");
  const [showRail, setShowRail] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("scene-observer-ready");
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>(".portfolio-scene[id]"),
    );
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      scenes.forEach((scene) => scene.classList.add("is-visible"));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          setActiveId((entry.target as HTMLElement).id);
          setShowRail(true);
        });
      },
      { threshold: 0.08, rootMargin: "-8% 0px -60%" },
    );

    scenes.forEach((scene) => observer.observe(scene));
    const hero = document.getElementById("inicio");
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.42) {
          setShowRail(false);
        }
      },
      { threshold: [0.42, 0.7] },
    );
    if (hero) heroObserver.observe(hero);
    return () => {
      observer.disconnect();
      heroObserver.disconnect();
      document.documentElement.classList.remove("scene-observer-ready");
    };
  }, []);

  const sceneLinks = navigation.filter((item) => item.number !== "00");

  return (
    <nav
      className={`section-rail ${showRail ? "is-visible" : ""}`}
      aria-label="Recorrido por el portafolio"
      aria-hidden={!showRail}
    >
      {sceneLinks.map((item) => {
        const id = item.href.split("#")[1];
        return (
          <a
            key={item.number}
            href={item.href}
            className={activeId === id ? "is-active" : ""}
            aria-current={activeId === id ? "location" : undefined}
            tabIndex={showRail ? 0 : -1}
          >
            <span>{item.number}</span>
            <b>{item.label}</b>
          </a>
        );
      })}
    </nav>
  );
}
