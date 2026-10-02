import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";

export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="screen-shell">
      <SiteHeader />
      <main className="screen-shell-main">{children}</main>
    </div>
  );
}
