import { beforeEach, describe, expect, it } from "vitest";
import { checarLimite, limparLimites } from "./rate-limit";
import { contactSchema } from "./schema";

const VALIDO = {
  name: "Fulana de Tal",
  email: "fulana@example.com",
  message: "Mensagem de teste com tamanho suficiente para passar.",
};

describe("contactSchema", () => {
  it("aceita mensagem válida", () => {
    expect(contactSchema.parse(VALIDO)).toMatchObject(VALIDO);
  });

  it("apara espaços em volta do nome e da mensagem", () => {
    const parsed = contactSchema.parse({
      ...VALIDO,
      name: "  Fulana de Tal  ",
    });
    expect(parsed.name).toBe("Fulana de Tal");
  });

  it("rejeita e-mail inválido", () => {
    expect(() =>
      contactSchema.parse({ ...VALIDO, email: "fulana(at)example.com" }),
    ).toThrow();
  });

  it("rejeita mensagem curta demais e longa demais", () => {
    expect(() => contactSchema.parse({ ...VALIDO, message: "oi" })).toThrow();
    expect(() =>
      contactSchema.parse({ ...VALIDO, message: "a".repeat(2001) }),
    ).toThrow();
  });

  // O robô preenche todo campo que encontra; gente não vê este.
  it("rejeita quando o honeypot vem preenchido", () => {
    expect(() =>
      contactSchema.parse({ ...VALIDO, website: "http://spam.example" }),
    ).toThrow();
    expect(() =>
      contactSchema.parse({ ...VALIDO, website: "" }),
    ).not.toThrow();
  });

  it("rejeita campo desconhecido no corpo do POST", () => {
    expect(() =>
      contactSchema.parse({ ...VALIDO, isAdmin: true }),
    ).toThrow();
  });
});

describe("checarLimite", () => {
  beforeEach(() => {
    limparLimites();
  });

  it("permite três envios e bloqueia o quarto", () => {
    const ip = "203.0.113.10";
    expect(checarLimite(ip).permitido).toBe(true);
    expect(checarLimite(ip).permitido).toBe(true);
    expect(checarLimite(ip).permitido).toBe(true);
    expect(checarLimite(ip).permitido).toBe(false);
  });

  it("conta cada IP separadamente", () => {
    for (let i = 0; i < 3; i += 1) {
      checarLimite("203.0.113.10");
    }
    expect(checarLimite("203.0.113.11").permitido).toBe(true);
  });

  it("libera de novo depois da janela de uma hora", () => {
    const ip = "203.0.113.12";
    const inicio = 1_000_000;
    for (let i = 0; i < 3; i += 1) {
      checarLimite(ip, inicio);
    }
    expect(checarLimite(ip, inicio).permitido).toBe(false);
    expect(checarLimite(ip, inicio + 60 * 60 * 1000 + 1).permitido).toBe(true);
  });

  it("informa quanto falta esperar quando bloqueia", () => {
    const ip = "203.0.113.13";
    const inicio = 2_000_000;
    for (let i = 0; i < 3; i += 1) {
      checarLimite(ip, inicio);
    }
    const bloqueado = checarLimite(ip, inicio + 10_000);
    expect(bloqueado.permitido).toBe(false);
    expect(bloqueado.esperaSegundos).toBeGreaterThan(3000);
    expect(bloqueado.esperaSegundos).toBeLessThanOrEqual(3600);
  });
});
