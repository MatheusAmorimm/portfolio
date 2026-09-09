"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

/** Rotas de topo da navegação — as que têm entrada no header. */
type Href = "/projetos" | "/sobre" | "/contato";

type Props = {
  href: Href;
  children: ReactNode;
};

/**
 * Link do header com a rota atual marcada: `aria-current="page"` para
 * leitor de tela e sublinhado dourado para quem enxerga. O sublinhado
 * cresce da esquerda no hover (`.nav-link`, globals.css).
 *
 * De cliente só porque precisa saber a rota. `usePathname` do next-intl
 * devolve o caminho INTERNO (`/projetos/[slug]` num case), então o
 * prefixo basta: Projetos fica ativo também dentro de um case.
 */
export function NavLink({ href, children }: Props) {
  const pathname = usePathname();
  const atual = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={atual ? "page" : undefined}
      className={`nav-link relative transition-colors duration-(--duration-hover) hover:text-foreground ${
        atual ? "text-foreground" : "text-muted"
      }`}
    >
      {children}
    </Link>
  );
}
