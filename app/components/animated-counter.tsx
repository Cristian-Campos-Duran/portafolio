"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  target: number;
  decimals: number;
  suffix: string;
  finalValue: string;
  label: string;
};

export function AnimatedCounter({
  target,
  decimals,
  suffix,
  finalValue,
  label,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      animatedRef.current = true;
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animatedRef.current) return;
        animatedRef.current = true;
        observer.disconnect();
        const started = performance.now();
        const duration = 820;
        const tick = (now: number) => {
          const progress = Math.min((now - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(target * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    observer.observe(host);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);

  const formatted = value.toLocaleString("es-CO", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div ref={hostRef} aria-label={`${finalValue} ${label}`}>
      <strong aria-hidden="true">
        {formatted}{suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}
