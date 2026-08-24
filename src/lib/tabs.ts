import type { Project } from "./projects/loader";
import type { ProjectFrontmatter } from "./projects/schema";

type Category = ProjectFrontmatter["category"];

/**
 * Abas da página de Projetos. A aba é apresentação; a categoria é dado
 * — e mantê-las separadas é o que permite reagrupar abas sem tocar em
 * nenhum MDX (CLAUDE.md, "Abas e categorias").
 *
 * O MVP lança com duas abas porque `infra` tem um único item. Na Fase 2,
 * `infra` ganha entrada própria aqui e nenhum case precisa mudar.
 *
 * O rótulo de cada aba é traduzível e vive em content/i18n sob
 * `projects.tabs.<id>`.
 */
export const TABS = [
  { id: "dados-ia", categories: ["dados-ia"] },
  { id: "web", categories: ["web", "infra"] },
] as const satisfies ReadonlyArray<{
  id: string;
  categories: readonly Category[];
}>;

export type TabId = (typeof TABS)[number]["id"];

export const DEFAULT_TAB: TabId = "dados-ia";

export function isTabId(value: string | undefined): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

/** Aba pedida na URL, caindo no padrão quando ausente ou inválida. */
export function resolveTab(value: string | undefined): TabId {
  return isTabId(value) ? value : DEFAULT_TAB;
}

export function projectsForTab(projects: Project[], tabId: TabId): Project[] {
  const tab = TABS.find((candidate) => candidate.id === tabId);
  if (!tab) {
    return [];
  }
  const categories: readonly Category[] = tab.categories;
  return projects.filter((project) =>
    categories.includes(project.frontmatter.category),
  );
}
