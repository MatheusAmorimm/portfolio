import type { Locale } from "next-intl";

/**
 * URL canônica do site. Ainda não há domínio próprio — a decisão do
 * autor é registrar depois que tudo estiver certo em localhost —, então
 * a Vercel injeta a URL do deploy em `VERCEL_PROJECT_PRODUCTION_URL`.
 * Quando o domínio existir, basta definir NEXT_PUBLIC_SITE_URL.
 *
 * Precisa ser absoluta: canonical, hreflang, sitemap e og:image não
 * aceitam caminho relativo.
 */
export function siteUrl(): URL {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicita) {
    return new URL(explicita);
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) {
    return new URL(`https://${vercel}`);
  }

  return new URL("http://localhost:3000");
}

/**
 * Indexação LIBERADA por decisão do autor (24/08/2026).
 *
 * Duas exceções ficam de pé, e nenhuma delas contraria a decisão:
 *
 * 1. Preview de deploy nunca indexa. Cada branch na Vercel ganha uma URL
 *    própria com o site inteiro; indexar todas cria conteúdo duplicado
 *    competindo com o domínio real pela busca do próprio nome do autor.
 *    Só `VERCEL_ENV === "production"` libera.
 * 2. `BLOCK_INDEXING=true` desliga tudo, sem precisar de deploy novo —
 *    é a saída de emergência se algo indevido for ao ar.
 */
export function permiteIndexacao(): boolean {
  if (process.env.BLOCK_INDEXING === "true") {
    return false;
  }

  const ambiente = process.env.VERCEL_ENV;
  // Fora da Vercel (local, ou outro host) segue a decisão do autor.
  return ambiente === undefined || ambiente === "production";
}

/** Caminho da mesma página no outro idioma, para hreflang. */
export const CAMINHOS: Record<string, Record<Locale, string>> = {
  "/": { pt: "/", en: "/en" },
  "/projetos": { pt: "/projetos", en: "/en/projects" },
  "/sobre": { pt: "/sobre", en: "/en/about" },
  "/contato": { pt: "/contato", en: "/en/contact" },
};

export function caminhoDoCase(slug: string): Record<Locale, string> {
  return { pt: `/projetos/${slug}`, en: `/en/projects/${slug}` };
}
