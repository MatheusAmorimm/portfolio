import type { Locale } from "next-intl";

/**
 * Currículo publicado, por idioma. Caminho a partir de `public/`.
 *
 * `null` significa que o autor ainda não forneceu o arquivo daquele
 * idioma: a interface mostra o marcador [→ preencher], nunca um botão
 * que daria 404.
 *
 * A versão publicada é a SEM endereço e SEM telefone (CLAUDE.md,
 * "Segurança"). Confira o conteúdo antes de trocar o arquivo — o Git
 * guarda todas as versões, e remover depois não apaga o histórico.
 */
export const CV: Record<Locale, string | null> = {
  pt: "/cv-matheus-amorim-pt.pdf",
  // → "/cv-matheus-amorim-en.pdf" quando o autor entregar a versão EN.
  en: null,
};
