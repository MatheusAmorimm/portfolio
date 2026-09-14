"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Atraso em segundos. Use 0,06–0,08 por item para escalonar irmãos. */
  delay?: number;
  className?: string;
};

/**
 * Entrada de bloco ao alcançar a viewport: fade + subida curta.
 *
 * Feito com `IntersectionObserver` e uma transição de CSS, e não com a
 * biblioteca de animação. O motivo é medido: quando `Reveal` passou a
 * ser usado em quase toda página, o subconjunto `domAnimation` deixou
 * de ser carregado sob demanda e virou 45 KB gzip no JS inicial de todo
 * mundo — contra um orçamento de 150 KB que já estava estourado. Isto
 * aqui faz o mesmo efeito por algumas centenas de bytes, e funciona em
 * qualquer navegador (ao contrário de `animation-timeline: view()`, que
 * ainda não é universal).
 *
 * Com isso a biblioteca saiu do projeto: a troca de aba, seu último
 * uso, passou a remontar o painel e reaproveitar a entrada de CSS dos
 * cards — ver `Tabs.tsx`.
 *
 * O observador desconecta no primeiro disparo: a animação acontece uma
 * vez, como manda o CLAUDE.md. Estado inicial, fallback sem JavaScript e
 * `prefers-reduced-motion` vivem no globals.css, presos ao `data-reveal`.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const alvo = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = alvo.current;
    if (!elemento) {
      return;
    }

    // Já dentro da viewport na carga (seção acima da dobra): mostra sem
    // esperar rolagem — sem isto, quem não rola nunca veria o conteúdo.
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -64px 0px" },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={alvo}
      data-reveal=""
      data-visivel={visivel ? "" : undefined}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
