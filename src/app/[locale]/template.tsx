import type { ReactNode } from "react";

/**
 * Transição entre páginas: fade curto a cada navegação.
 *
 * `template.tsx` e não `layout.tsx` porque o template remonta a cada
 * rota — é justamente isso que faz a animação disparar de novo.
 *
 * CSS puro, pela mesma razão do hero: a primeira página que o visitante
 * abre passa por aqui, e o elemento de LCP não pode esperar JavaScript.
 * O bloco de prefers-reduced-motion no globals.css já desativa.
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
