/**
 * Parte o corpo de um .mdx nos marcadores <!-- lang:pt --> e
 * <!-- lang:en -->. O marcador usa sintaxe de comentário HTML, que NÃO
 * é MDX válido — e é por isso que funciona como fronteira: esta função
 * remove a linha do marcador antes de qualquer fatia chegar ao
 * compilador. Dentro das fatias, comentário usa a sintaxe de chaves do
 * JSX, nunca a de HTML.
 */
const MARKER = /^[ \t]*<!--\s*lang:([a-z-]+)\s*-->[ \t]*$/gm;

export type SplitBody = { pt: string; en: string | null };

export function splitByLang(body: string): SplitBody {
  const markers = [...body.matchAll(MARKER)];

  const firstIndex = markers[0]?.index ?? body.length;
  if (body.slice(0, firstIndex).trim().length > 0) {
    throw new Error(
      "Conteúdo antes do primeiro marcador de idioma seria descartado em silêncio",
    );
  }

  const slices = new Map<string, string>();
  markers.forEach((marker, i) => {
    const lang = marker[1];
    if (lang !== "pt" && lang !== "en") {
      throw new Error(`Marcador de idioma desconhecido: lang:${lang}`);
    }
    if (slices.has(lang)) {
      throw new Error(`Marcador duplicado: lang:${lang}`);
    }
    const start = (marker.index ?? 0) + marker[0].length;
    const end = markers[i + 1]?.index ?? body.length;
    slices.set(lang, body.slice(start, end).trim());
  });

  const pt = slices.get("pt");
  if (!pt) {
    throw new Error(
      "Bloco <!-- lang:pt --> ausente — PT é o idioma padrão e obrigatório",
    );
  }

  return { pt, en: slices.get("en") ?? null };
}
