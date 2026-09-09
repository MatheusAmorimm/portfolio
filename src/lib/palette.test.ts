import { describe, expect, it } from "vitest";
import { composite, contrastRatio } from "./contrast";
import { colorToken as token } from "./tokens";

// Todo par texto/fundo que o site realmente produz.
const PAIRS: Array<[string, string, number]> = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["foreground", "surface-hover", 4.5],
  ["muted", "background", 4.5],
  ["muted", "surface", 4.5],
  ["muted", "surface-hover", 4.5],
  ["accent", "background", 4.5],
  ["accent", "surface", 4.5],
  ["accent-cool", "background", 4.5],
  ["accent-cool", "surface", 4.5],
  ["on-accent", "accent-strong", 4.5],
];

/*
 * Os brilhos do fundo (globals.css, `body::before`) clareiam o fundo, e
 * o teste de cor chapada não enxerga isso. Estas são as opacidades
 * máximas de cada camada, no ponto mais claro do degradê. Se alterar
 * lá, altere aqui — é o que faz a mudança ser medida em vez de
 * estimada.
 */
const GLOWS: Array<[string, number]> = [
  ["accent", 0.1],
  ["accent-cool", 0.18],
];

describe("paleta", () => {
  it.each(PAIRS)(
    "%s sobre %s passa WCAG AA (>= %s:1)",
    (fg, bg, minimum) => {
      expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(
        minimum,
      );
    },
  );

  it.each(GLOWS)(
    "texto secundário sobre o ponto mais claro do brilho %s passa AA",
    (layer, alpha) => {
      const brightest = composite(token(layer), token("background"), alpha);
      expect(contrastRatio(token("muted"), brightest)).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(contrastRatio(token("accent"), brightest)).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );

  it("bordas se distinguem do fundo", () => {
    expect(
      contrastRatio(token("border"), token("background")),
    ).toBeGreaterThan(1.1);
    expect(
      contrastRatio(token("border-strong"), token("surface")),
    ).toBeGreaterThan(1.1);
  });

  it("token inexistente falha alto, em vez de virar cor vazia", () => {
    expect(() => token("nao-existe")).toThrow("globals.css");
  });
});
