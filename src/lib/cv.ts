import type { Locale } from "next-intl";

/**
 * Currículo publicado, por idioma. Caminho a partir de `public/`.
 *
 * `null` significa que não há arquivo para aquele idioma: a interface
 * mostra um aviso, nunca um botão que daria 404. Hoje os dois idiomas
 * têm PDF; o inglês foi gerado em 13/09/2026 a partir do original em PT.
 *
 * A versão publicada é a SEM endereço e SEM telefone (CLAUDE.md,
 * "Segurança"). Confira o conteúdo antes de trocar o arquivo — o Git
 * guarda todas as versões, e remover depois não apaga o histórico.
 */
export const CV: Record<Locale, string | null> = {
  pt: "/cv-matheus-amorim-pt.pdf",
  en: "/cv-matheus-amorim-en.pdf",
};
