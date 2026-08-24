import { readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { compileBody } from "./render";
import { splitByLang } from "./split";

describe("compileBody", () => {
  it("compila markdown para componente renderizável", async () => {
    const Body = await compileBody("## Contexto\n\nTexto com **negrito**.");
    const html = renderToStaticMarkup(createElement(Body));
    expect(html).toContain("<h2>Contexto</h2>");
    expect(html).toContain("<strong>negrito</strong>");
  });

  it("rejeita comentário HTML, que não é sintaxe MDX", async () => {
    await expect(compileBody("<!-- comentário -->")).rejects.toThrow();
  });

  it("o _template.mdx real passa pelo pipeline nos dois idiomas", async () => {
    const raw = readFileSync(
      join(process.cwd(), "src/content/projects/_template.mdx"),
      "utf8",
    );
    const { pt, en } = splitByLang(matter(raw).content);

    const ptHtml = renderToStaticMarkup(
      createElement(await compileBody(pt)),
    );
    expect(ptHtml).toContain("Contexto");
    expect(ptHtml).toContain("Aprendizados");
    expect(ptHtml).not.toContain("Como criar um case"); // comentário some

    expect(en).not.toBeNull();
    const enHtml = renderToStaticMarkup(
      createElement(await compileBody(en ?? "")),
    );
    expect(enHtml).toContain("Context");
  });
});
