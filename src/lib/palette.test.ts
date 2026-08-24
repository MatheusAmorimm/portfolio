import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { colorToken as token } from "./tokens";

// Todo par texto/fundo que o site realmente produz.
const PAIRS: Array<[string, string, number]> = [
  ["foreground", "background", 4.5],
  ["foreground", "surface", 4.5],
  ["muted", "background", 4.5],
  ["muted", "surface", 4.5],
  ["accent", "background", 4.5],
  ["accent", "surface", 4.5],
  ["on-accent", "accent-strong", 4.5],
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
