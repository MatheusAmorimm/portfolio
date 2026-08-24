import { describe, expect, it } from "vitest";
import { projectSchema } from "./schema";

// Valores obviamente artificiais — fixture de teste, não conteúdo do site.
const VALID = {
  slug: "case-exemplo",
  category: "dados-ia",
  featured: true,
  draft: false,
  year: 2025,
  stack: ["Python", "scikit-learn"],
  cover: "/covers/case-exemplo.webp",
  links: { repo: "https://github.com/exemplo/repo" },
  title: { pt: "Exemplo", en: "Example" },
  summary: { pt: "Resumo.", en: "Summary." },
};

describe("projectSchema", () => {
  it("aceita frontmatter completo e válido", () => {
    expect(projectSchema.parse(VALID)).toEqual(VALID);
  });

  it("aceita links vazio", () => {
    expect(() => projectSchema.parse({ ...VALID, links: {} })).not.toThrow();
  });

  it("rejeita categoria fora do enum", () => {
    expect(() =>
      projectSchema.parse({ ...VALID, category: "outra" }),
    ).toThrow();
  });

  it("rejeita ano implausível ou não inteiro", () => {
    expect(() => projectSchema.parse({ ...VALID, year: 1999 })).toThrow();
    expect(() => projectSchema.parse({ ...VALID, year: 2025.5 })).toThrow();
  });

  it("rejeita stack vazia", () => {
    expect(() => projectSchema.parse({ ...VALID, stack: [] })).toThrow();
  });

  it("rejeita cover que não é caminho absoluto", () => {
    expect(() =>
      projectSchema.parse({ ...VALID, cover: "covers/x.webp" }),
    ).toThrow();
  });

  it("rejeita URL inválida em links", () => {
    expect(() =>
      projectSchema.parse({ ...VALID, links: { repo: "github.com/x" } }),
    ).toThrow();
  });

  it("rejeita campo desconhecido", () => {
    // A spec § 9 removeu `confidential` do schema do PRD. O modo strict
    // garante que ele — ou qualquer typo — não volta por engano.
    expect(() =>
      projectSchema.parse({ ...VALID, confidential: true }),
    ).toThrow();
  });

  it("rejeita título sem EN", () => {
    expect(() =>
      projectSchema.parse({ ...VALID, title: { pt: "Só PT" } }),
    ).toThrow();
  });

  it("rejeita slug fora do padrão kebab-case", () => {
    expect(() =>
      projectSchema.parse({ ...VALID, slug: "Case_Exemplo" }),
    ).toThrow();
  });
});
