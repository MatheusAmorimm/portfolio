import { DISPLAY_NAME, LEGAL_NAME, SOCIAL } from "@/lib/social";
import { siteUrl } from "@/lib/site";

/**
 * JSON-LD do site, num só grafo: `Person` (conteudo-site.md § 9) e
 * `WebSite`.
 *
 * O `Person` é o que permite ao Google ligar o site à pessoa em vez de
 * tratá-lo como página solta, e alimenta o painel de conhecimento numa
 * busca pelo nome. O `WebSite` é o que ele lê para escolher o nome do
 * site mostrado acima do título no resultado da busca — sem ele, o nome
 * sai do <title> ou do domínio, nem sempre bem.
 *
 * Campos vêm de fonte já confirmada pelo autor (lib/social.ts) e do
 * conteudo-site.md. Nada é inventado aqui: `jobTitle` e as instituições
 * saem da § 3 e da § 4.
 */
export function JsonLd({ jobTitle }: { jobTitle: string }) {
  const url = siteUrl().toString();
  const pessoa = `${url}#person`;

  const dados = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": pessoa,
        name: LEGAL_NAME,
        url,
        jobTitle,
        affiliation: {
          "@type": "CollegeOrUniversity",
          name: "Pontifícia Universidade Católica de São Paulo",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "Universidade Nove de Julho",
        },
        sameAs: [SOCIAL.github, SOCIAL.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        name: DISPLAY_NAME,
        url,
        author: { "@id": pessoa },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // O conteúdo é objeto nosso, serializado — não entra dado de
      // usuário aqui, que é o que tornaria isto um vetor de injeção.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
