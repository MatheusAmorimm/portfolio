import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Largura máxima e respiro lateral do site inteiro. Header, Footer e
 * todas as seções passam por aqui — trocar o gutter é uma edição só.
 */
export function Container({ children, className = "" }: Props) {
  return (
    <div
      className={`mx-auto w-full max-w-(--width-container) px-(--space-gutter) ${className}`}
    >
      {children}
    </div>
  );
}
