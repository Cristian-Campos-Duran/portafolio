"use client";

import { useEffect, useState } from "react";

export type CaseNavItem = {
  id: string;
  number: string;
  label: string;
};

export function CaseSectionNav({ items }: { items: CaseNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive((visible.target as HTMLElement).id);
      },
      { threshold: [0.04, 0.1], rootMargin: "-8% 0px -62%" },
    );
    items.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="case-section-nav" aria-label="Apartados del caso">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? "is-active" : ""}
          aria-current={active === item.id ? "location" : undefined}
        >
          <span>{item.number}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
