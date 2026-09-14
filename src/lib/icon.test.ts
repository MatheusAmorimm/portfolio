import { describe, expect, it } from "vitest";
import { ICON, iconSvg } from "./icon";
import { colorToken } from "./tokens";

describe("geometria do ícone", () => {
  it("mantém todos os pontos inteiros dentro do quadrado", () => {
    for (const dot of ICON.dots) {
      expect(dot.x - ICON.dotRadius).toBeGreaterThan(0);
      expect(dot.x + ICON.dotRadius).toBeLessThan(1);
      expect(dot.y - ICON.dotRadius).toBeGreaterThan(0);
      expect(dot.y + ICON.dotRadius).toBeLessThan(1);
    }
  });

  it("espalha pontos dos dois lados da reta — é dispersão, não colar", () => {
    const { x1, y1, x2, y2 } = ICON.line;
    const slope = (y2 - y1) / (x2 - x1);
    const residuals = ICON.dots.map((dot) => dot.y - (y1 + slope * (dot.x - x1)));

    expect(residuals.some((r) => r > 0)).toBe(true);
    expect(residuals.some((r) => r < 0)).toBe(true);
  });

  it("sobe da esquerda para a direita, como a reta do hero", () => {
    // y cresce para baixo em tela: subir é y2 < y1.
    expect(ICON.line.x2).toBeGreaterThan(ICON.line.x1);
    expect(ICON.line.y2).toBeLessThan(ICON.line.y1);
  });
});

describe("iconSvg", () => {
  it("usa as cores do globals.css, não hex próprios", () => {
    const svg = iconSvg();
    expect(svg).toContain(colorToken("background"));
    expect(svg).toContain(colorToken("accent-cool"));
    expect(svg).toContain(colorToken("accent"));
  });

  it("desenha um ponto por entrada e uma única reta", () => {
    const svg = iconSvg(32);
    expect(svg.match(/<circle /g)).toHaveLength(ICON.dots.length);
    expect(svg.match(/<path /g)).toHaveLength(1);
    expect(svg).toContain('viewBox="0 0 32 32"');
  });
});
