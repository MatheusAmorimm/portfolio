"use client";

import { LazyMotion, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Atraso em segundos. Use 0,06–0,08 por item para escalonar irmãos. */
  delay?: number;
  className?: string;
};

/**
 * Entrada de bloco ao alcançar a viewport: fade + subida curta.
 *
 * O subconjunto `domAnimation` (~18 KB) é importado de forma dinâmica,
 * e não estática: assim ele vira um chunk separado, fora do JS inicial
 * da página. `strict` proíbe `motion.*`, que traria o pacote completo
 * (35–50 KB) de volta sem avisar — spec § 6.2.
 *
 * Anima só `opacity` e `transform`, `once: true`, 400 ms — os limites do
 * CLAUDE.md. O `data-reveal` é o gancho do fallback sem JavaScript
 * declarado no layout: sem ele, o `initial` renderizado no servidor
 * deixaria a seção invisível para sempre.
 *
 * `prefers-reduced-motion` DESATIVA, não reduz: o bloco global do
 * globals.css só alcança animação de CSS, e esta é orquestrada por JS.
 */
const loadFeatures = () => import("./features").then((mod) => mod.default);

export function Reveal({ children, delay = 0, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.div
        data-reveal=""
        className={className}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-64px" }}
        transition={{
          duration: reduced ? 0 : 0.4,
          delay: reduced ? 0 : delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
