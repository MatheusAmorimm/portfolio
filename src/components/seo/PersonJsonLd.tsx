import { LEGAL_NAME, SOCIAL } from "@/lib/social";
import { siteUrl } from "@/lib/site";

/**
 * JSON-LD `Person` — conteudo-site.md § 9. É o que permite ao Google
 * ligar o site à pessoa em vez de tratá-lo como página solta, e o que
 * alimenta o painel de conhecimento numa busca pelo nome.
 *
 * Campos vêm de fonte já confirmada pelo autor (lib/social.ts) e do
 * conteudo-site.md. Nada é inventado aqui: `jobTitle` e as instituições
 * saem da § 3 e da § 4.
 */
export function PersonJsonLd({ jobTitle }: { jobTitle: string }) {
  const dados = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: LEGAL_NAME,
    url: siteUrl().toString(),
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
