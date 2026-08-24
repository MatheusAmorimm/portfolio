import { describe, expect, it } from "vitest";
import { splitByLang } from "./split";

const BOTH = `
<!-- lang:pt -->

## Contexto

Texto em português.

<!-- lang:en -->

## Context

English text.
`;

describe("splitByLang", () => {
  it("separa as fatias de PT e EN", () => {
    const { pt, en } = splitByLang(BOTH);
    expect(pt).toContain("Texto em português.");
    expect(en).toContain("English text.");
  });

  it("não vaza um idioma na fatia do outro", () => {
    const { pt, en } = splitByLang(BOTH);
    expect(pt).not.toContain("English");
    expect(en).not.toContain("português");
  });

  it("remove as linhas de marcador das fatias", () => {
    const { pt, en } = splitByLang(BOTH);
    expect(pt).not.toContain("lang:");
    expect(en).not.toContain("lang:");
  });

  it("EN ausente vira null, sem erro", () => {
    expect(splitByLang("<!-- lang:pt -->\n\nSó PT.")).toEqual({
      pt: "Só PT.",
      en: null,
    });
  });

  it("lança se o bloco PT estiver ausente", () => {
    expect(() => splitByLang("<!-- lang:en -->\n\nOnly EN.")).toThrow(
      "lang:pt",
    );
  });

  it("lança para conteúdo antes do primeiro marcador", () => {
    expect(() =>
      splitByLang("Solto.\n\n<!-- lang:pt -->\n\nCorpo."),
    ).toThrow("antes do primeiro marcador");
  });

  it("lança para idioma desconhecido e para marcador duplicado", () => {
    expect(() => splitByLang("<!-- lang:es -->\n\nHola.")).toThrow(
      "desconhecido",
    );
    expect(() =>
      splitByLang("<!-- lang:pt -->\nA\n<!-- lang:pt -->\nB"),
    ).toThrow("duplicado");
  });
});
