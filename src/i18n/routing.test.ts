import { describe, expect, it } from "vitest";
import { routing } from "./routing";

describe("routing", () => {
  it("tem PT como idioma padrão", () => {
    expect(routing.defaultLocale).toBe("pt");
  });

  it("suporta exatamente PT e EN", () => {
    expect(routing.locales).toEqual(["pt", "en"]);
  });

  it("espelha as rotas de projetos", () => {
    expect(routing.pathnames["/projetos"]).toEqual({
      pt: "/projetos",
      en: "/projects",
    });
  });

  it("espelha a rota de case individual preservando o slug", () => {
    expect(routing.pathnames["/projetos/[slug]"]).toEqual({
      pt: "/projetos/[slug]",
      en: "/projects/[slug]",
    });
  });

  it("espelha sobre e contato", () => {
    expect(routing.pathnames["/sobre"]).toEqual({
      pt: "/sobre",
      en: "/about",
    });
    expect(routing.pathnames["/contato"]).toEqual({
      pt: "/contato",
      en: "/contact",
    });
  });

  it("omite o prefixo no idioma padrão", () => {
    expect(routing.localePrefix).toBe("as-needed");
  });
});
