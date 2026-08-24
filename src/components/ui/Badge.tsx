import type { ReactNode } from "react";

/**
 * Etiqueta de tecnologia. Usa `muted` sobre `surface`, nunca o accent:
 * spec § 4.1 — se tudo é destaque, nada é.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-badge bg-surface px-2.5 py-1 font-mono text-label text-muted">
      {children}
    </span>
  );
}
