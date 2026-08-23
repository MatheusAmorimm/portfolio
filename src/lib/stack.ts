/**
 * Stack do autor, agrupada. Fonte: docs/conteudo-site.md § 5.
 * Nome de tecnologia não se traduz; o rótulo do grupo sim, e vive em
 * content/i18n sob a chave `stack.<id>`.
 */
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
      "proxy reverso",
      "Certbot / TLS",
      "WireGuard",
      "VPS",
      "GitHub Actions",
    ],
  },
  {
    id: "learning",
    items: [
      "Estatística aplicada",
      "mineração de dados",
      "SQL avançado",
      "R",
      "AWS",
    ],
  },
] as const;
