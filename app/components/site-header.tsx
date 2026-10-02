"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CV_PATH, contactConfig, navigation } from "../site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !open) return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="inner-site-header">
      <Link className="wordmark" href="/" aria-label="Ir a la portada">
        CDC<span>.</span>
      </Link>
      <div className="inner-header-actions">
        <a
          className="cv-download-link"
          href={CV_PATH}
          download="Cristian_David_Campos_CV.pdf"
          aria-label="Descargar CV de Cristian David Campos en PDF"
        >
          <i aria-hidden="true" />
          <span>Descargar CV</span>
        </a>
        <button
          ref={buttonRef}
          className={`menu-button ${open ? "is-open" : ""}`}
          type="button"
          aria-expanded={open}
          aria-controls="inner-site-menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        className={`inner-menu-layer ${open ? "is-visible" : ""}`}
        id="inner-site-menu"
        aria-hidden={!open}
      >
        <button
          className="inner-menu-backdrop"
          type="button"
          aria-label="Cerrar menú"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <nav className="inner-menu-panel" aria-label="Menú principal">
          <p>Portafolio / Navegación</p>
          {navigation.map((item, index) => (
            <Link
              key={item.number}
              ref={index === 0 ? firstLinkRef : undefined}
              href={item.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span>{item.number}</span>
              {item.label}
            </Link>
          ))}
          <div className="inner-menu-resources">
            <a
              href={CV_PATH}
              download="Cristian_David_Campos_CV.pdf"
              tabIndex={open ? 0 : -1}
              aria-label="Descargar CV de Cristian David Campos en PDF"
            >
              CV · PDF
            </a>
            {contactConfig.linkedin && (
              <a href={contactConfig.linkedin} tabIndex={open ? 0 : -1}>
                LinkedIn
              </a>
            )}
            {contactConfig.behance && (
              <a href={contactConfig.behance} tabIndex={open ? 0 : -1}>
                Behance
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
