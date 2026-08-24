import { describe, expect, it } from "vitest";
import { STACK_GROUPS, stackItemKey, type StackItem } from "./stack";
import en from "@/content/i18n/en.json";
import pt from "@/content/i18n/pt.json";

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
    // O `as const` do módulo produz uma tupla literal por grupo, e o
    // flatMap não unifica tuplas de tipos diferentes — daí a anotação.
    const todos: StackItem[] = STACK_GROUPS.flatMap((g) => [...g.items]);
    const chaves = todos.map(stackItemKey);
    expect(new Set(chaves).size).toBe(chaves.length);
  });

  it("mantém os itens exatos do grupo de infraestrutura", () => {
    const infra = STACK_GROUPS.find((g) => g.id === "infra");
    expect(infra?.items.map(stackItemKey)).toEqual([
      "Nginx",
      "reverseProxy",
      "Certbot / TLS",
      "WireGuard",
      "VPS",
      "GitHub Actions",
    ]);
  });

  // Item traduzível sem tradução vira a própria chave impressa na tela
  // ("reverseProxy" em vez de "proxy reverso"), e nada mais acusaria.
  it("todo item traduzível existe nos dois dicionários", () => {
    const todos: StackItem[] = STACK_GROUPS.flatMap((group) => [
      ...group.items,
    ]);
    const chaves = todos
      .filter((item) => typeof item !== "string")
      .map((item) => item.i18n);

    expect(chaves.length).toBeGreaterThan(0);
    for (const chave of chaves) {
      expect(pt.stack.items, `pt.json: falta stack.items.${chave}`)
        .toHaveProperty(chave);
      expect(en.stack.items, `en.json: falta stack.items.${chave}`)
        .toHaveProperty(chave);
    }
  });

  it("nenhum item traduzível ficou com o texto igual nos dois idiomas", () => {
    const ptItems: Record<string, string> = pt.stack.items;
    const enItems: Record<string, string> = en.stack.items;

    for (const chave of Object.keys(ptItems)) {
      expect(ptItems[chave]).not.toBe(enItems[chave]);
    }
  });
});
