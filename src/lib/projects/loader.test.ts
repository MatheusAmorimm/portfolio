import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getProject, listProjects } from "./loader";

const FIXTURES = join(process.cwd(), "src/lib/projects/__fixtures__");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("listProjects", () => {
  it("carrega e valida os .mdx, ignorando arquivos com prefixo _", () => {
    const slugs = listProjects(join(FIXTURES, "ok")).map(
      (p) => p.frontmatter.slug,
    );
    expect(slugs).toContain("case-valido");
    expect(slugs).toContain("rascunho");
    expect(slugs).toHaveLength(2);
  });

  it("ordena por ano decrescente", () => {
    const years = listProjects(join(FIXTURES, "ok")).map(
      (p) => p.frontmatter.year,
    );
    expect(years).toEqual([2024, 2023]);
  });

  it("filtra rascunhos em produção", () => {
    vi.stubEnv("NODE_ENV", "production");
    const slugs = listProjects(join(FIXTURES, "ok")).map(
      (p) => p.frontmatter.slug,
    );
    expect(slugs).toEqual(["case-valido"]);
  });

  it("lança nomeando o arquivo quando o frontmatter é inválido", () => {
    expect(() =>
      listProjects(join(FIXTURES, "frontmatter-invalido")),
    ).toThrow("sem-categoria.mdx");
  });

  it("lança quando o slug difere do nome do arquivo", () => {
    expect(() => listProjects(join(FIXTURES, "slug-divergente"))).toThrow(
      "outro-nome.mdx",
    );
  });

  it("lança quando o corpo não tem o marcador de PT", () => {
    expect(() =>
      listProjects(join(FIXTURES, "corpo-sem-marcador")),
    ).toThrow("sem-marcador.mdx");
  });
});

describe("getProject", () => {
  it("devolve o case pelo slug, e undefined para slug inexistente", () => {
    const dir = join(FIXTURES, "ok");
    expect(getProject("case-valido", dir)?.body.en).toContain(
      "English body.",
    );
    expect(getProject("rascunho", dir)?.body.en).toBeNull();
    expect(getProject("nao-existe", dir)).toBeUndefined();
  });
});
