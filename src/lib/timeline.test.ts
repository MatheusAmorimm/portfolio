import { describe, expect, it } from "vitest";
import { formatMonth, TIMELINE } from "./timeline";

describe("TIMELINE", () => {
  it("tem as seis entradas do conteudo-site.md", () => {
    expect(TIMELINE).toHaveLength(6);
  });

  it("está em ordem cronológica decrescente por início", () => {
    const starts = TIMELINE.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it("classifica cada entrada como formação ou experiência", () => {
    for (const entry of TIMELINE) {
      expect(["education", "work"]).toContain(entry.kind);
    }
  });

  it("mantém a entrada da PUC-SP exata", () => {
    const puc = TIMELINE.find((e) => e.id === "puc");
    expect(puc).toEqual({
      id: "puc",
      kind: "education",
      start: "2025-02",
      end: "2028-07",
    });
  });

  it("toda entrada em andamento tem end nulo, e só a atual tem", () => {
    const ongoing = TIMELINE.filter((e) => e.end === null);
    expect(ongoing.map((e) => e.id)).toEqual(["compare"]);
  });
});

describe("formatMonth", () => {
  // Trava contra o bug de fuso: sem timeZone UTC, o formatador renderiza
  // o instante em America/Sao_Paulo e volta um mês.
  it("não desloca o mês por causa do fuso local", () => {
    expect(formatMonth("2025-06", "pt")).toBe("jun. de 2025");
    expect(formatMonth("2025-02", "pt")).toBe("fev. de 2025");
    expect(formatMonth("2019-02", "pt")).toBe("fev. de 2019");
  });

  it("formata em inglês para o locale en", () => {
    expect(formatMonth("2025-06", "en")).toBe("Jun 2025");
  });
});
