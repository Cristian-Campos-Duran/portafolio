import type { Metadata } from "next";
import "./globals.css";
import "./interface.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portafolio-cristian-preview.cristiancampos.chatgpt.site"),
  title: {
    default: "Cristian David Campos — Portafolio",
    template: "%s",
  },
  description:
    "Portafolio de Cristian Campos: edición de video, motion graphics, contenido audiovisual y diseño multimedia.",
  openGraph: {
    title: "Cristian David Campos — Portafolio",
    description:
      "Edición de video, motion graphics, contenido audiovisual y diseño multimedia.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cristian David Campos — Portafolio",
    description:
      "Edición de video, motion graphics, contenido audiovisual y diseño multimedia.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

import "./gallery.css";
