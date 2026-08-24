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
  // O padrão é BLOQUEAR. Só a string exata "true" libera — qualquer
  // outro valor, inclusive ausência, mantém o site fora do Google.
  it("bloqueia por padrão", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "");
    expect(permiteIndexacao()).toBe(false);
  });

  it("bloqueia para valor que não seja exatamente true", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "1");
    expect(permiteIndexacao()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "yes");
    expect(permiteIndexacao()).toBe(false);
  });

  it("libera com true explícito", () => {
    vi.stubEnv("NEXT_PUBLIC_ALLOW_INDEXING", "true");
    expect(permiteIndexacao()).toBe(true);
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
