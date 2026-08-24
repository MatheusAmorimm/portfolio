import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CV } from "./cv";
import { routing } from "@/i18n/routing";

describe("CV", () => {
  it("cobre exatamente os idiomas do site", () => {
    expect(Object.keys(CV).sort()).toEqual([...routing.locales].sort());
  });

  // Sem esta trava, renomear ou remover o PDF deixaria um botão de
  // download apontando para 404 — e nada acusaria.
  it("todo arquivo declarado existe em public/", () => {
    for (const [locale, path] of Object.entries(CV)) {
      if (path === null) continue;
      expect(
        existsSync(join(process.cwd(), "public", path)),
        `CV de ${locale} declarado como ${path}, mas o arquivo não existe`,
      ).toBe(true);
    }
  });
});
