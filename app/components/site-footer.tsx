import Link from "next/link";
import { CV_PATH, contactConfig } from "../site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <span className="footer-mark">CDC<span>.</span></span>
        <p>Edición de video · Motion graphics · Diseño multimedia</p>
      </div>
      <nav aria-label="Enlaces finales">
        <Link href="/contacto">Contacto</Link>
        <a href={CV_PATH} download="Cristian_David_Campos_CV.pdf">
          Descargar CV
        </a>
        {contactConfig.linkedin && <a href={contactConfig.linkedin}>LinkedIn</a>}
        {contactConfig.behance && <a href={contactConfig.behance}>Behance</a>}
        <Link href="/">Portada</Link>
      </nav>
    </footer>
  );
}

