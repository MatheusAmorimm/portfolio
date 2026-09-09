import { scatter } from "@/lib/scatter";

const WIDTH = 800;
const HEIGHT = 600;

type Props = {
  /** Mesma semente, mesma cena — no servidor, no cliente e na capa. */
  seed: string;
  className?: string;
};

/**
 * A cena do site em SVG: pontos dispersos e a reta ajustada a eles.
 *
 * Server Component: os pontos são calculados uma vez, no servidor, e o
 * SVG vai pronto no HTML. A animação é CSS (`scene-dot`, `scene-line`
 * no globals.css) e por isso começa antes de qualquer JavaScript.
 *
 * Decorativa: `aria-hidden`, e sem título — não há dado aqui, só forma.
 * O atraso de cada ponto vai inline porque depende do índice; o atraso
 * de base (`--scene-delay`) vem de quem a hospeda.
 */
export function ScatterStage({ seed, className }: Props) {
  const { points, line } = scatter(seed);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`halo-${seed}`} cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor="var(--color-accent-cool)"
            stopOpacity="0.14"
          />
          <stop offset="100%" stopColor="var(--color-accent-cool)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse
        className="scene-halo"
        cx={WIDTH / 2}
        cy={HEIGHT / 2}
        rx={WIDTH * 0.46}
        ry={HEIGHT * 0.42}
        fill={`url(#halo-${seed})`}
      />

      {points.map((point, index) => {
        const cx = round(point.x * WIDTH);
        const cy = round(point.y * HEIGHT);
        const r = round(point.r * WIDTH);
        const delay = `calc(var(--scene-delay, 0ms) + ${index} * var(--scene-dot-gap))`;
        // Dois círculos por ponto: o halo translúcido é o que dá brilho
        // sem filtro de SVG, que custaria caro a cada quadro da entrada.
        return (
          <g key={index}>
            <circle
              className="scene-dot"
              cx={cx}
              cy={cy}
              r={r * 2.4}
              fill="var(--color-accent-cool)"
              fillOpacity={0.16}
              style={{ animationDelay: delay }}
            />
            <circle
              className="scene-dot"
              cx={cx}
              cy={cy}
              r={r}
              fill="var(--color-accent-cool)"
              fillOpacity={0.92}
              style={{ animationDelay: delay }}
            />
          </g>
        );
      })}

      <line
        className="scene-line"
        x1={0}
        y1={round(line.y1 * HEIGHT)}
        x2={WIDTH}
        y2={round(line.y2 * HEIGHT)}
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
