import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
};

/**
 * Título de seção: display, com um traço dourado curto por cima.
 *
 * Substitui a etiqueta mono em caixa alta que fazia esse papel. O mono
 * fica reservado ao que é dado — ano, tag, data — e o título volta a
 * ter o peso de título. Um traço só, sempre da mesma cor: é a
 * assinatura das seções, não decoração por seção.
 */
export function SectionTitle({ id, children, className = "" }: Props) {
  return (
    <h2
      id={id}
      className={`font-display text-h2 font-semibold tracking-tight text-foreground before:mb-4 before:block before:h-0.5 before:w-8 before:bg-accent before:content-[''] ${className}`}
    >
      {children}
    </h2>
  );
}
