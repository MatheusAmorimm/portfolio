/**
 * Stack do autor, agrupada. Fonte: docs/conteudo-site.md § 5.
 *
 * Nome próprio de tecnologia não se traduz e fica como string literal.
 * Mas nem todo item é nome próprio: "proxy reverso" e "mineração de
 * dados" são termos comuns, e imprimi-los crus deixava português na
 * versão inglesa do site. Esses viram `{ i18n }`, resolvido pelo
 * componente contra `stack.items.<chave>` nos dicionários.
 */
export type StackItem = string | { i18n: string };
export const STACK_GROUPS = [
  {
    id: "daily",
    items: [
      "Python",
      "SQL / MySQL",
      "pandas",
      "scikit-learn",
      "Linux",
      "Docker",
      "Git",
      "Power BI",
      "Excel",
    ],
  },
  {
    id: "building",
    items: [
      "Next.js",
      "React",
      "TypeScript",
      ".NET / C#",
      "Angular",
      "FastAPI",
      "NestJS",
      "PostgreSQL",
      "MongoDB",
      "Tauri",
    ],
  },
  {
    id: "infra",
    items: [
      "Nginx",
      { i18n: "reverseProxy" },
      "Certbot / TLS",
      "WireGuard",
      "VPS",
      "GitHub Actions",
    ],
  },
  {
    id: "learning",
    items: [
      { i18n: "appliedStatistics" },
      { i18n: "dataMining" },
      { i18n: "advancedSql" },
      "R",
      "AWS",
    ],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  items: readonly StackItem[];
}>;

/** Chave estável para React, tanto para literal quanto para item traduzido. */
export function stackItemKey(item: StackItem): string {
  return typeof item === "string" ? item : item.i18n;
}
