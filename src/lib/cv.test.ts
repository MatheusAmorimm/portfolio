import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CV, descreverDownload, downloadSchema } from "./cv";
import { routing } from "@/i18n/routing";

describe("CV", () => {
  it("cobre exatamente os idiomas do site", () => {
    expect(Object.keys(CV).sort()).toEqual([...routing.locales].sort());
  });

  // Sem esta trava, renomear ou remover o PDF deixaria um botão de
  // download apontando para 404 — e nada acusaria.
  it("todo arquivo declarado existe em public/", () => {
    for (const [locale, path] of Object.entries(CV)) {
      if (path === null) continue;
      expect(
        existsSync(join(process.cwd(), "public", path)),
        `CV de ${locale} declarado como ${path}, mas o arquivo não existe`,
      ).toBe(true);
    }
  });
});

describe("downloadSchema", () => {
  it("aceita idioma do site e origem conhecida", () => {
    expect(downloadSchema.parse({ locale: "en", origem: "sobre" })).toEqual({
      locale: "en",
      origem: "sobre",
    });
  });

  it("rejeita idioma ou origem fora da lista", () => {
    expect(() =>
      downloadSchema.parse({ locale: "es", origem: "hero" }),
    ).toThrow();
    expect(() =>
      downloadSchema.parse({ locale: "pt", origem: "rodape" }),
    ).toThrow();
  });

  // O POST é público: nada além do esperado entra no e-mail do autor.
  it("rejeita campo extra no corpo", () => {
    expect(() =>
      downloadSchema.parse({ locale: "pt", origem: "hero", ip: "1.2.3.4" }),
    ).toThrow();
  });
});

describe("descreverDownload", () => {
  const meioDia = new Date("2026-09-14T15:00:00Z"); // 12:00 em Brasília

  it("descreve idioma, origem e horário de Brasília", () => {
    const texto = descreverDownload({ locale: "en", origem: "hero" }, meioDia);
    expect(texto).toContain("Idioma:  inglês");
    expect(texto).toContain("botão do topo da home");
    expect(texto).toContain("14/09/2026");
    expect(texto).toContain("12:00");
  });

  it("não carrega nada que identifique o visitante", () => {
    const texto = descreverDownload({ locale: "pt", origem: "sobre" }, meioDia);
    expect(texto).not.toMatch(/ip|agent|navegador/i);
  });
});
