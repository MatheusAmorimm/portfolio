/**
 * Trajetória. Fonte: docs/conteudo-site.md § 4.
 * Datas em ISO `YYYY-MM` para poderem ser ordenadas e comparadas;
 * a exibição formatada fica no componente. `end: null` = em andamento.
 * Título e instituição vivem em content/i18n sob `timeline.<id>`.
 */
export type TimelineEntry = {
  id: "compare" | "puc" | "marche" | "uninove" | "hsprevent" | "ibrasa";
  kind: "education" | "work";
  start: string;
  end: string | null;
};

export const TIMELINE: TimelineEntry[] = [
  { id: "compare", kind: "work", start: "2025-06", end: null },
  { id: "puc", kind: "education", start: "2025-02", end: "2028-07" },
  { id: "marche", kind: "work", start: "2024-06", end: "2025-05" },
  { id: "uninove", kind: "education", start: "2023-02", end: "2025-06" },
  { id: "hsprevent", kind: "work", start: "2022-09", end: "2023-06" },
  { id: "ibrasa", kind: "work", start: "2019-02", end: "2020-01" },
];

/**
 * `timeZone: "UTC"` é obrigatório, não estilo. Sem ele, o instante criado
 * por Date.UTC é renderizado no fuso local — em America/Sao_Paulo (UTC-3)
 * isso cai no último dia do mês anterior, e a timeline inteira sai um mês
 * atrasada: jun/2025 vira mai/2025.
 */
export function formatMonth(iso: string, locale: string) {
  const [year, month] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
