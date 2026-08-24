import { describe, expect, it } from "vitest";
import { DEFAULT_TAB, isTabId, resolveTab, TABS } from "./tabs";
import { projectSchema } from "./projects/schema";

describe("TABS", () => {
  // Se um case novo usar uma categoria que nenhuma aba cobre, ele some
  // da página de Projetos em silêncio. Este teste transforma isso em
  // falha de build.
  it("cobre toda categoria do schema, sem repetir nenhuma", () => {
    const doSchema = projectSchema.shape.category.options;
    const nasAbas = TABS.flatMap((tab) => [...tab.categories]);

    expect([...nasAbas].sort()).toEqual([...doSchema].sort());
    expect(new Set(nasAbas).size).toBe(nasAbas.length);
  });

  it("lança o MVP com duas abas", () => {
    expect(TABS.map((tab) => tab.id)).toEqual(["dados-ia", "web"]);
  });
});

describe("resolveTab", () => {
  it("aceita aba válida", () => {
    expect(resolveTab("web")).toBe("web");
  });

  it("cai no padrão para ausente ou inválida, sem erro", () => {
    expect(resolveTab(undefined)).toBe(DEFAULT_TAB);
    expect(resolveTab("nao-existe")).toBe(DEFAULT_TAB);
    expect(resolveTab("")).toBe(DEFAULT_TAB);
  });

  it("isTabId reconhece só os ids declarados", () => {
    expect(isTabId("dados-ia")).toBe(true);
    expect(isTabId("infra")).toBe(false);
  });
});
