/**
 * Fuente y tamaño de los botones del sitio. El valor efectivo se guarda en
 * `textos_sitio` (claves `boton.fuente` y `boton.tamano`) y lo edita el admin
 * desde /admin; el layout inyecta un <style> que redefine `--btn-font` y
 * `--btn-size` a partir de aquí.
 */

export type ButtonFont = {
  key: string;
  label: string;
  /** Stack CSS completo (la primera familia debe tener su @font-face en globals.css). */
  stack: string;
};

export const BUTTON_FONTS: ButtonFont[] = [
  { key: "coolvetica", label: "Coolvetica", stack: "'Coolvetica', 'Inter', system-ui, sans-serif" },
  { key: "inter", label: "Sistema (Inter)", stack: "'Inter', system-ui, sans-serif" },
  { key: "super-bouncer", label: "Super Bouncer", stack: "'Super Bouncer', 'Inter', system-ui, sans-serif" },
  { key: "porkys", label: "Porky's", stack: "'Porkys', 'Inter', system-ui, sans-serif" },
  { key: "epoxy-history", label: "EpoXY History", stack: "'EpoXY History', 'Inter', system-ui, sans-serif" },
];

export const DEFAULT_BUTTON_FONT = "coolvetica";
export const DEFAULT_BUTTON_SIZE = 17;
export const BUTTON_SIZE_MIN = 11;
export const BUTTON_SIZE_MAX = 32;

export function fontStackFor(key: string | undefined | null): string {
  return (
    BUTTON_FONTS.find((f) => f.key === key)?.stack ??
    BUTTON_FONTS.find((f) => f.key === DEFAULT_BUTTON_FONT)!.stack
  );
}

export function clampButtonSize(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_BUTTON_SIZE;
  return Math.min(BUTTON_SIZE_MAX, Math.max(BUTTON_SIZE_MIN, Math.round(n)));
}
