import { scatter } from "@/lib/scatter";

const WIDTH = 800;
const HEIGHT = 600;

/*
 * Área do gráfico dentro do viewBox: margem para os eixos à esquerda e
 * embaixo, respiro em cima e à direita. Os pontos (0–1) são mapeados
 * para dentro dela.
 */
const PLOT = { left: 64, top: 36, right: 776, bottom: 548 };
const PLOT_W = PLOT.right - PLOT.left;
const PLOT_H = PLOT.bottom - PLOT.top;

/** Marcas por eixo. Sem número: a cena não tem escala, só forma. */
const TICKS = 6;
/** Intervalo entre uma linha da grade e a próxima, ao surgirem. */
const GRID_GAP_MS = 40;

type Props = {
  /** Mesma semente, mesma cena — no servidor e no cliente. */
  seed: string;
  className?: string;
};

/**
 * A cena do site: um gráfico que se constrói. Primeiro os eixos crescem
 * a partir da origem; depois a grade e as marcas surgem; os pontos
 * caem um a um; por fim a reta de tendência se desenha por cima.
 *
 * Server Component: a geometria é calculada uma vez, no servidor, e o
 * SVG vai pronto no HTML. A coreografia é CSS (`scene-*` no
 * globals.css) e por isso começa antes de qualquer JavaScript. Os
 * atrasos que dependem de índice vão inline; o atraso de base
 * (`--scene-delay`) vem de quem hospeda a cena.
 *
 * Decorativa: `aria-hidden`, sem título — não há dado aqui.
 */
export function ScatterStage({ seed, className }: Props) {
  const { points, line } = scatter(seed);
  const delay = (offset: string) => `calc(var(--scene-delay, 0ms) + ${offset})`;

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
        cx={PLOT.left + PLOT_W / 2}
        cy={PLOT.top + PLOT_H / 2}
        rx={PLOT_W * 0.46}
        ry={PLOT_H * 0.44}
        fill={`url(#halo-${seed})`}
      />

      {/* Grade: linhas pontilhadas nas marcas, surgindo em ordem. */}
      {Array.from({ length: TICKS - 1 }, (_, i) => {
        const step = (i + 1) / TICKS;
        const x = round(PLOT.left + step * PLOT_W);
        const y = round(PLOT.bottom - step * PLOT_H);
        const gridDelay = delay(`var(--scene-grid-at) + ${i * GRID_GAP_MS}ms`);
        return (
          <g
            key={i}
            stroke="var(--color-muted)"
            strokeOpacity={0.28}
            strokeDasharray="2 7"
          >
            <line
              className="scene-grid"
              x1={x}
              y1={PLOT.top}
              x2={x}
              y2={PLOT.bottom}
              style={{ animationDelay: gridDelay }}
            />
            <line
              className="scene-grid"
              x1={PLOT.left}
              y1={y}
              x2={PLOT.right}
              y2={y}
              style={{ animationDelay: gridDelay }}
            />
          </g>
        );
      })}

      {/* Eixos: crescem a partir da origem, no canto inferior esquerdo. */}
      <rect
        className="scene-axis-x"
        x={PLOT.left}
        y={PLOT.bottom - 0.75}
        width={PLOT_W}
        height={1.5}
        fill="var(--color-muted)"
      />
      <rect
        className="scene-axis-y"
        x={PLOT.left - 0.75}
        y={PLOT.top}
        width={1.5}
        height={PLOT_H}
        fill="var(--color-muted)"
      />

      {/* Marcas dos eixos, na mesma cadência da grade. */}
      {Array.from({ length: TICKS }, (_, i) => {
        const step = (i + 1) / TICKS;
        const x = round(PLOT.left + step * PLOT_W);
        const y = round(PLOT.bottom - step * PLOT_H);
        const tickDelay = delay(`var(--scene-grid-at) + ${i * GRID_GAP_MS}ms`);
        return (
          <g key={i} fill="var(--color-muted)">
            <rect
              className="scene-tick"
              x={x - 0.75}
              y={PLOT.bottom}
              width={1.5}
              height={8}
              style={{ animationDelay: tickDelay }}
            />
            <rect
              className="scene-tick"
              x={PLOT.left - 8}
              y={y - 0.75}
              width={8}
              height={1.5}
              style={{ animationDelay: tickDelay }}
            />
          </g>
        );
      })}

      {points.map((point, index) => {
        const cx = round(PLOT.left + point.x * PLOT_W);
        const cy = round(PLOT.top + point.y * PLOT_H);
        const r = round(point.r * WIDTH);
        const dotDelay = delay(
          `var(--scene-dots-at) + ${index} * var(--scene-dot-gap)`,
        );
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
              style={{ animationDelay: dotDelay }}
            />
            <circle
              className="scene-dot"
              cx={cx}
              cy={cy}
              r={r}
              fill="var(--color-accent-cool)"
              fillOpacity={0.92}
              style={{ animationDelay: dotDelay }}
            />
          </g>
        );
      })}

      <line
        className="scene-line"
        x1={PLOT.left}
        y1={round(PLOT.top + line.y1 * PLOT_H)}
        x2={PLOT.right}
        y2={round(PLOT.top + line.y2 * PLOT_H)}
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
