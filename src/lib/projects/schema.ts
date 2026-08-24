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

export const projectSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug em kebab-case"),
  category: z.enum(["dados-ia", "web", "infra"]),
  featured: z.boolean(),
  draft: z.boolean(),
  year: z.number().int().min(2015).max(2100),
  stack: z.array(z.string().min(1)).min(1),
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
