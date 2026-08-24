import type { Locale } from "next-intl";
import { z } from "zod";

/**
 * Schema do frontmatter de src/content/projects/*.mdx — CLAUDE.md,
 * "Modelo de conteúdo". Validado na build: schema inválido QUEBRA a
 * build, por design. Não afrouxe para "consertar" um case — conserte
 * o case.
 */
const localized = z.strictObject({
  pt: z.string().min(1),
  en: z.string().min(1),
});

/**
 * Item de stack. Nome próprio de tecnologia é o caso comum e continua
 * sendo string — "Python" e "Docker" são iguais nos dois idiomas.
 * Termo comum (uma técnica, uma disciplina) usa a forma bilíngue, senão
 * português vaza para a versão inglesa do site.
 *
 *   stack:
 *     - Python
 *     - { pt: Regressão, en: Regression }
 *
 * A tradução vive AQUI, e não em content/i18n, porque é vocabulário de
 * um case só — o dicionário guarda texto de interface.
 */
const stackEntry = z.union([z.string().min(1), localized]);

export type StackEntry = z.infer<typeof stackEntry>;

export function stackLabel(entry: StackEntry, locale: Locale): string {
  return typeof entry === "string" ? entry : entry[locale];
}

/** Só os itens que não dependem de idioma — usado pela capa gerada. */
export function neutralStack(entries: readonly StackEntry[]): string[] {
  return entries.filter((entry) => typeof entry === "string");
}

export const projectSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug em kebab-case"),
  category: z.enum(["dados-ia", "web", "infra"]),
  featured: z.boolean(),
  draft: z.boolean(),
  year: z.number().int().min(2015).max(2100),
  stack: z.array(stackEntry).min(1),
  cover: z
    .string()
    .startsWith("/", "cover é caminho absoluto a partir de public/"),
  links: z.strictObject({
    repo: z.url().optional(),
    demo: z.url().optional(),
  }),
  title: localized,
  summary: localized,
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;
