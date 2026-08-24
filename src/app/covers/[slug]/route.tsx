import { ImageResponse } from "next/og";
import { listProjects } from "@/lib/projects/loader";
import { colorToken } from "@/lib/tokens";

/**
 * Capa tipográfica provisória de cada case, gerada na build como PNG.
 *
 * É placeholder deliberado: enquanto não existe arte real, o card
 * mostra tipografia na paleta do site em vez de uma imagem quebrada.
 * Quando a capa real chegar, basta colocar o arquivo em
 * `public/covers/<slug>.png` — arquivo estático tem precedência sobre
 * rota, então o `cover` do frontmatter não muda e esta rota
 * simplesmente para de ser usada para aquele slug.
 *
 * A URL termina em `.png` de propósito: o matcher do proxy de i18n
 * ignora caminhos com ponto, então a capa não entra no roteamento por
 * idioma — ela é a mesma nos dois.
 */
export const dynamicParams = false;

const SIZE = { width: 1200, height: 630 };

export function generateStaticParams() {
  return listProjects().map((project) => ({
    slug: `${project.frontmatter.slug}.png`,
  }));
}

export async function GET(
  _request: Request,
  context: RouteContext<"/covers/[slug]">,
) {
  const { slug } = await context.params;
  const wanted = slug.replace(/\.png$/, "");
  const project = listProjects().find(
    (candidate) => candidate.frontmatter.slug === wanted,
  );

  if (!project) {
    return new Response("Capa não encontrada", { status: 404 });
  }

  const { title, year, stack } = project.frontmatter;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: colorToken("background"),
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: 26,
            letterSpacing: 3,
            color: colorToken("accent"),
          }}
        >
          {year}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 120,
              height: 6,
              backgroundColor: colorToken("accent"),
              marginBottom: 32,
            }}
          />
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              lineHeight: 1.15,
              color: colorToken("foreground"),
            }}
          >
            {title.pt}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: colorToken("muted") }}>
          {stack.join("  ·  ")}
        </div>
      </div>
    ),
    SIZE,
  );
}
