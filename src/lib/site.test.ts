import { afterEach, describe, expect, it, vi } from "vitest";
import { CAMINHOS, caminhoDoCase, permiteIndexacao, siteUrl } from "./site";
import { routing } from "@/i18n/routing";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("siteUrl", () => {
  it("prefere a URL explícita", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://matheusamorim.dev");
    expect(siteUrl().origin).toBe("https://matheusamorim.dev");
  });

  it("cai na URL de produção da Vercel quando não há domínio próprio", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio.vercel.app");
    expect(siteUrl().origin).toBe("https://portfolio.vercel.app");
  });

  it("usa localhost em desenvolvimento", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(siteUrl().origin).toBe("http://localhost:3000");
  });
});

describe("permiteIndexacao", () => {
  it("libera em produção", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(permiteIndexacao()).toBe(true);
  });

  // Cada branch ganha uma URL própria na Vercel; indexar todas põe
  // cópias do site competindo com o domínio real na busca pelo nome.
  it("bloqueia preview e desenvolvimento da Vercel", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(permiteIndexacao()).toBe(false);
    vi.stubEnv("VERCEL_ENV", "development");
    expect(permiteIndexacao()).toBe(false);
  });

  it("libera fora da Vercel, onde não há ambiente declarado", () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    expect(permiteIndexacao()).toBe(true);
  });

  it("BLOCK_INDEXING desliga tudo, inclusive produção", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("BLOCK_INDEXING", "true");
    expect(permiteIndexacao()).toBe(false);
  });
});

describe("CAMINHOS", () => {
  it("cobre todas as rotas espelhadas do routing", () => {
    const doRouting = Object.keys(routing.pathnames).filter(
      (rota) => !rota.includes("["),
    );
    expect(Object.keys(CAMINHOS).sort()).toEqual(doRouting.sort());
  });

  it("tem os dois idiomas em toda entrada", () => {
    for (const [rota, mapa] of Object.entries(CAMINHOS)) {
      expect(Object.keys(mapa).sort(), rota).toEqual([...routing.locales].sort());
    }
  });

  it("espelha o caminho do case preservando o slug", () => {
    expect(caminhoDoCase("avicultura")).toEqual({
      pt: "/projetos/avicultura",
      en: "/en/projects/avicultura",
    });
  });
});
