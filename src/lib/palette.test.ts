import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

const css = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

function token(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!match) {
    throw new Error(`Token --color-${name} não encontrado em globals.css`);
  }
  return match[1];
}

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
});
