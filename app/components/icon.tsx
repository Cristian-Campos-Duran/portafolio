type IconName = "open" | "next" | "back" | "down" | "play" | "close" | "download";
const paths: Record<IconName, string> = {
  open: "M6 18 18 6M6 6h12v12", next: "M4 12h16m-7-7 7 7-7 7", back: "M20 12H4m7-7-7 7 7 7",
  down: "m6 9 6 6 6-6", play: "m8 5 11 7-11 7Z", close: "m6 6 12 12M6 18 18 6", download: "M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4",
};
export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return <svg className={`p-icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
