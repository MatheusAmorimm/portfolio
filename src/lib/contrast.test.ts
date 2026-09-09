import { describe, expect, it } from "vitest";
import {
  composite,
  contrastRatio,
  hexToRgb,
  relativeLuminance,
} from "./contrast";

describe("hexToRgb", () => {
  it("converte hex de seis dígitos", () => {
    expect(hexToRgb("#FFFFFF")).toEqual([255, 255, 255]);
    expect(hexToRgb("#0B0E14")).toEqual([11, 14, 20]);
  });

  it("aceita hex sem cerquilha e em minúsculas", () => {
    expect(hexToRgb("fbbf24")).toEqual([251, 191, 36]);
  });

  it("rejeita valor malformado", () => {
    expect(() => hexToRgb("#GGG")).toThrow();
  });
});

describe("relativeLuminance", () => {
  it("dá 0 para preto e 1 para branco", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("dá 21:1 entre preto e branco", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("é simétrico", () => {
    expect(contrastRatio("#0B0E14", "#FBBF24")).toBeCloseTo(
      contrastRatio("#FBBF24", "#0B0E14"),
      5,
    );
  });

  it("dá 1:1 para a mesma cor", () => {
    expect(contrastRatio("#12161F", "#12161F")).toBeCloseTo(1, 5);
  });
});

describe("composite", () => {
  it("com alpha 0 devolve o fundo, com alpha 1 devolve a camada", () => {
    expect(composite("#ffffff", "#000000", 0)).toBe("#000000");
    expect(composite("#ffffff", "#000000", 1)).toBe("#ffffff");
  });

  it("interpola canal a canal em sRGB", () => {
    expect(composite("#ffffff", "#000000", 0.5)).toBe("#808080");
    expect(composite("#e3ba6a", "#141b2d", 0.1)).toBe("#292b33");
  });
});
