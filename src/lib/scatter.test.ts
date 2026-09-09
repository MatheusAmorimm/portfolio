import { describe, expect, it } from "vitest";
import { fitLine, scatter, type Point } from "./scatter";

describe("scatter", () => {
  it("é determinística: a mesma semente produz a mesma cena", () => {
    expect(scatter("matheus-amorim")).toEqual(scatter("matheus-amorim"));
  });

  it("sementes diferentes produzem cenas diferentes", () => {
    expect(scatter("avicultura")).not.toEqual(scatter("mpfinance"));
  });

  it("gera a quantidade pedida de pontos, 36 por padrão", () => {
    expect(scatter("x").points).toHaveLength(36);
    expect(scatter("x", 12).points).toHaveLength(12);
  });

  // Coordenadas em fração da cena, para o SVG e a capa escalarem cada um
  // ao seu tamanho. A margem evita ponto cortado na borda.
  it("mantém todo ponto dentro da cena, com margem", () => {
    for (const { x, y, r } of scatter("bordas", 200).points) {
      expect(x).toBeGreaterThanOrEqual(0.05);
      expect(x).toBeLessThanOrEqual(0.95);
      expect(y).toBeGreaterThanOrEqual(0.08);
      expect(y).toBeLessThanOrEqual(0.92);
      expect(r).toBeGreaterThan(0);
    }
  });

  // A reta é o ajuste real dos pontos, não decoração: a cena diz "dados
  // e a estrutura que passa por eles", e isso só é honesto se a reta
  // for o que a estatística diria.
  it("a reta da cena é o ajuste por mínimos quadrados dos pontos", () => {
    const cena = scatter("ajuste");
    const esperado = fitLine(cena.points);
    expect(cena.line).toEqual(esperado);
  });

  it("a reta atravessa a cena de ponta a ponta", () => {
    const { line } = scatter("largura");
    expect(line.x1).toBe(0);
    expect(line.x2).toBe(1);
  });

  // O sinal é o da tela: y cresce para baixo. Tendência de subida visual
  // é inclinação negativa — a cena deve "subir" da esquerda para a
  // direita, como um gráfico que conta uma história boa.
  it("a tendência sobe da esquerda para a direita, em toda semente", () => {
    for (const seed of ["a", "b", "c", "avicultura", "seneb", "dns-manager"]) {
      const { line } = scatter(seed);
      expect(line.y1).toBeGreaterThan(line.y2);
    }
  });
});

describe("fitLine", () => {
  it("recupera exatamente uma reta sem ruído", () => {
    const points: Point[] = [0, 0.25, 0.5, 0.75, 1].map((x) => ({
      x,
      y: 0.8 - 0.5 * x,
      r: 1,
    }));
    const { y1, y2 } = fitLine(points);
    expect(y1).toBeCloseTo(0.8, 10);
    expect(y2).toBeCloseTo(0.3, 10);
  });

  it("devolve reta horizontal na média quando x não varia", () => {
    const points: Point[] = [
      { x: 0.5, y: 0.2, r: 1 },
      { x: 0.5, y: 0.6, r: 1 },
    ];
    const { y1, y2 } = fitLine(points);
    expect(y1).toBeCloseTo(0.4, 10);
    expect(y2).toBeCloseTo(0.4, 10);
  });
});
