import { describe, expect, it } from "vitest";
import { STACK_GROUPS } from "./stack";

describe("STACK_GROUPS", () => {
  it("tem os quatro grupos do conteudo-site.md, nesta ordem", () => {
    expect(STACK_GROUPS.map((g) => g.id)).toEqual([
      "daily",
      "building",
      "infra",
      "learning",
    ]);
  });

  it("nenhum grupo está vazio", () => {
    for (const group of STACK_GROUPS) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("não repete tecnologia entre grupos", () => {
    const all = STACK_GROUPS.flatMap((g) => g.items);
    expect(new Set(all).size).toBe(all.length);
  });

  it("mantém os itens exatos do grupo de infraestrutura", () => {
    const infra = STACK_GROUPS.find((g) => g.id === "infra");
    expect(infra?.items).toEqual([
      "Nginx",
      "proxy reverso",
      "Certbot / TLS",
      "WireGuard",
      "VPS",
      "GitHub Actions",
    ]);
  });
});
