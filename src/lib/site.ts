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
 * Indexação continua bloqueada até o autor liberar. Portfólio
 * incompleto indexado é pior que portfólio nenhum: o Google guarda a
 * versão pela qual passou primeiro, e é ela que aparece na busca por
 * um nome que um recrutador vai procurar.
 */
export function permiteIndexacao(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
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
