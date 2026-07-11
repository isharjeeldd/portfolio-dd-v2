/**
 * No-flash accent boot (FR-THEME-2/3). Runs inline in <head> before paint:
 * reads the persisted accent and corrects `data-accent` on <html> so a
 * returning visitor never flashes the default.
 *
 * KEEP IN SYNC with lib/accent.ts (ACCENT_STORAGE_KEY, ACCENTS,
 * DEFAULT_ACCENT) — this script is intentionally dependency-free.
 */
export function AccentScript() {
  const script = `(function(){try{var a=localStorage.getItem("ms-accent");if(["crimson","lime","blue","amber"].indexOf(a)>-1){document.documentElement.setAttribute("data-accent",a);}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
