import { ImageResponse } from "next/og";
import { listProjects } from "@/lib/projects/loader";
import { neutralStack } from "@/lib/projects/schema";
import { scatter } from "@/lib/scatter";
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

/*
 * A cena do site, semeada pelo slug: cada capa ganha uma dispersão
 * própria, e as capas deixam de ser quatro retângulos iguais. Ocupa a
 * metade direita, para não disputar com o texto. O Satori não desenha
 * SVG com CSS, então os pontos são divs redondas e a reta é uma div
 * girada — o mesmo `lib/scatter` do hero, outra forma de pintar.
 */
const CENA = { left: 0.44 * SIZE.width, width: 0.56 * SIZE.width };

function Cena({ seed }: { seed: string }) {
  const { points, line } = scatter(seed);
  const dx = CENA.width;
  const dy = (line.y2 - line.y1) * SIZE.height;
  const comprimento = Math.hypot(dx, dy);
  const angulo = (Math.atan2(dy, dx) * 180) / Math.PI;
  // O Satori gira em torno do centro do elemento e ignora
  // transform-origin, então a div é centrada no ponto médio da reta.
  const meioX = CENA.left + dx / 2;
  const meioY = ((line.y1 + line.y2) / 2) * SIZE.height;

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      {points.map((point, index) => {
        const raio = point.r * CENA.width;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: CENA.left + point.x * CENA.width - raio,
              top: point.y * SIZE.height - raio,
              width: raio * 2,
              height: raio * 2,
              borderRadius: "50%",
              backgroundColor: colorToken("accent-cool"),
              opacity: 0.85,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: meioX - comprimento / 2,
          top: meioY - 2,
          width: comprimento,
          height: 4,
          borderRadius: 2,
          backgroundColor: colorToken("accent"),
          transform: `rotate(${angulo}deg)`,
        }}
      />
    </div>
  );
}

/**
 * Cada renderização instancia Satori e o conversor para PNG, que são
 * caros. Sem memória, seis capas pedidas ao mesmo tempo viravam seis
 * renderizações simultâneas e derrubavam os workers do Next com
 * `WorkerError` — em desenvolvimento, todas as capas voltavam 500.
 *
 * `prontas` guarda o PNG já gerado; `emVoo` faz requisições
 * concorrentes da MESMA capa esperarem uma única renderização em vez de
 * dispararem uma cada. A chave inclui os dados desenhados, então editar
 * o case regenera a capa sem precisar reiniciar nada.
 */
const prontas = new Map<string, ArrayBuffer>();
const emVoo = new Map<string, Promise<ArrayBuffer>>();

async function renderizar(
  chave: string,
  desenhar: () => ImageResponse,
): Promise<ArrayBuffer> {
  const pronta = prontas.get(chave);
  if (pronta) {
    return pronta;
  }

  const jaEmVoo = emVoo.get(chave);
  if (jaEmVoo) {
    return jaEmVoo;
  }

  const voo = desenhar()
    .arrayBuffer()
    .then((bytes) => {
      prontas.set(chave, bytes);
      return bytes;
    })
    .finally(() => {
      emVoo.delete(chave);
    });

  emVoo.set(chave, voo);
  return voo;
}

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

  // Nada de `title` aqui: a capa é a MESMA nos dois idiomas (o proxy de
  // i18n ignora caminhos com ponto), então gravar o título em português
  // punha texto PT dentro da página inglesa. O slug é identificador, não
  // se traduz, e o título já aparece como texto logo abaixo do card —
  // no image ele era redundante além de errado.
  const { slug: id, year, stack } = project.frontmatter;
  const tecnologias = neutralStack(stack);

  const bytes = await renderizar(
    `${id}|${year}|${tecnologias.join(",")}`,
    () =>
      new ImageResponse(
        (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: colorToken("background"),
          padding: 80,
        }}
      >
        <Cena seed={id} />

        <div
          style={{
            display: "flex",
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
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: -1,
              color: colorToken("foreground"),
            }}
          >
            {id}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: colorToken("muted") }}>
          {tecnologias.join("  ·  ")}
        </div>
      </div>
        ),
        SIZE,
      ),
  );

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/png",
      // A capa só muda quando o case muda, e aí a chave da memória muda
      // junto. Um ano de cache imutável é seguro e tira a imagem do
      // caminho crítico em toda visita seguinte.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
