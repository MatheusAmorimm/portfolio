import { notFound } from "next/navigation";

/**
 * Captura qualquer caminho que não casou com uma rota real e joga no
 * not-found DESTE segmento — que tem header, rodapé e texto no idioma
 * da página.
 *
 * Sem esta rota, o Next cai no 404 interno dele: página em branco, em
 * inglês, sem navegação. O visitante que erra a URL fica sem saída.
 */
export default function CatchAll(): never {
  notFound();
}
