import type { MetadataRoute } from "next";
import { listProjects } from "@/lib/projects/loader";
import { CAMINHOS, caminhoDoCase, siteUrl } from "@/lib/site";

/**
 * Sitemap com hreflang por entrada: cada URL declara a versão no outro
 * idioma em `alternates.languages`, que é como o Google entende que
 * /sobre e /en/about são a mesma página, e não conteúdo duplicado.
 *
 * Cases em rascunho não entram — `listProjects` já os exclui em
 * produção, então o sitemap não precisa filtrar de novo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const absoluta = (caminho: string) => new URL(caminho, base).toString();

  const entrada = (
    mapa: { pt: string; en: string },
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: absoluta(mapa.pt),
    priority,
    alternates: {
      languages: {
        "pt-BR": absoluta(mapa.pt),
        "en-US": absoluta(mapa.en),
      },
    },
  });

  return [
    entrada(CAMINHOS["/"], 1),
    entrada(CAMINHOS["/projetos"], 0.9),
    entrada(CAMINHOS["/sobre"], 0.8),
    entrada(CAMINHOS["/contato"], 0.7),
    ...listProjects().map((projeto) =>
      entrada(caminhoDoCase(projeto.frontmatter.slug), 0.8),
    ),
  ];
}
