import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { projectSchema, type ProjectFrontmatter } from "./schema";
import { splitByLang, type SplitBody } from "./split";

/**
 * Camada de leitura de src/content/projects. Usa fs — roda só no
 * servidor, durante a build (SSG). Qualquer arquivo inválido lança, e o
 * erro derruba a build: é o gate que o CLAUDE.md exige.
 */
const CONTENT_DIR = join(process.cwd(), "src", "content", "projects");

export type Project = {
  frontmatter: ProjectFrontmatter;
  body: SplitBody;
};

/**
 * Memória do último carregamento, invalidada quando qualquer arquivo do
 * diretório muda de nome ou de data de modificação.
 *
 * Sem isto, `listProjects` relia e reparseava TODOS os MDX a cada
 * chamada — e há cinco chamadores por request em algumas rotas. No log
 * do autor isso aparecia como `generate-params: 1154ms`, e a rajada de
 * leituras simultâneas era o que derrubava os workers do Next quando
 * várias capas eram pedidas ao mesmo tempo.
 *
 * A impressão digital usa `statSync`, que não abre o arquivo: editar um
 * case continua refletindo na hora em desenvolvimento.
 */
let memoria: { digital: string; projetos: Project[] } | null = null;

function digitalDoDiretorio(dir: string): string {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .sort()
    .map((file) => `${file}:${statSync(join(dir, file)).mtimeMs}`)
    .join("|");
}

export function listProjects(dir: string = CONTENT_DIR): Project[] {
  // Fixtures de teste passam um diretório próprio e não usam a memória:
  // cada caso precisa de leitura limpa, inclusive os que trocam NODE_ENV.
  if (dir !== CONTENT_DIR) {
    return carregar(dir);
  }

  const digital = digitalDoDiretorio(dir);
  if (memoria && memoria.digital === digital) {
    return memoria.projetos;
  }

  const projetos = carregar(dir);
  memoria = { digital, projetos };
  return projetos;
}

function carregar(dir: string): Project[] {
  const files = readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
    .sort();

  const projects = files.map((file) => {
    const raw = readFileSync(join(dir, file), "utf8");
    const { data, content } = matter(raw);

    const parsed = projectSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `${file}: frontmatter inválido\n${z.prettifyError(parsed.error)}`,
      );
    }
    if (file !== `${parsed.data.slug}.mdx`) {
      throw new Error(
        `${file}: slug "${parsed.data.slug}" difere do nome do arquivo`,
      );
    }

    try {
      return { frontmatter: parsed.data, body: splitByLang(content) };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${file}: ${message}`);
    }
  });

  // Valida TODOS os arquivos antes de filtrar: rascunho quebrado também
  // quebra a build — o repositório é peça do portfólio.
  const visible =
    process.env.NODE_ENV === "production"
      ? projects.filter((project) => !project.frontmatter.draft)
      : projects;

  return visible.sort((a, b) => b.frontmatter.year - a.frontmatter.year);
}

export function getProject(
  slug: string,
  dir: string = CONTENT_DIR,
): Project | undefined {
  return listProjects(dir).find(
    (project) => project.frontmatter.slug === slug,
  );
}
