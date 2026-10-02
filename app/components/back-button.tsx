"use client";

import { useRouter } from "next/navigation";

export function BackButton({ fallback = "/proyectos" }: { fallback?: string }) {
  const router = useRouter();

  const goBack = () => {
    const referrer = document.referrer;
    if (referrer) {
      try {
        if (new URL(referrer).origin === window.location.origin) {
          window.history.back();
          return;
        }
      } catch {
        // Fall through to the stored internal location.
      }
    }

    try {
      const raw = sessionStorage.getItem("portfolio:returnTo");
      if (raw) {
        const stored = JSON.parse(raw) as { path?: string; timestamp?: number };
        if (
          stored.path?.startsWith("/") &&
          stored.timestamp &&
          Date.now() - stored.timestamp < 60 * 60 * 1000
        ) {
          router.push(stored.path);
          return;
        }
      }
    } catch {
      // The deterministic fallback remains available.
    }
    router.push(fallback);
  };

  return (
    <button type="button" className="case-back" onClick={goBack}>
      <span aria-hidden="true">←</span>
      Volver
    </button>
  );
}
