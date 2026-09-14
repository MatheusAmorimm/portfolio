import { colorToken } from "@/lib/tokens";

/**
 * Ícone do site: a cena do hero em miniatura — pontos frios e a reta
 * dourada sobre o navy. É o único desenho que o site tem, e o favicon é
 * onde ele precisa caber em 16 pixels: por isso cinco pontos e uma reta,
 * sem eixos nem grade.
 *
 * Geometria em frações do lado, para que o SVG do favicon, o PNG de
 * 48 px e o ícone de 180 px da tela inicial do iOS saiam do mesmo lugar.
 */
export const ICON = {
  /** Raio dos cantos, fração do lado. O apple-icon usa zero: o iOS arredonda. */
  corner: 0.22,
  dotRadius: 0.07,
  lineWidth: 0.08,
  line: { x1: 0.19, y1: 0.77, x2: 0.81, y2: 0.3 },
  // Resíduos maiores que o diâmetro do ponto: sem isso, em 180 px os
  // pontos viram contas enfiadas na reta, e a cena é dispersão.
  dots: [
    { x: 0.27, y: 0.56 },
    { x: 0.4, y: 0.79 },
    { x: 0.52, y: 0.38 },
    { x: 0.66, y: 0.6 },
    { x: 0.78, y: 0.3 },
  ],
} as const;

/** Cores do ícone, lidas do globals.css — a mesma fonte do site inteiro. */
export function iconColors() {
  return {
    background: colorToken("background"),
    dots: colorToken("accent-cool"),
    line: colorToken("accent"),
  };
}

/** SVG do favicon. Vetorial: o navegador desenha no tamanho que quiser. */
export function iconSvg(size = 32): string {
  const c = iconColors();
  const px = (fraction: number) => (fraction * size).toFixed(2);
  const { x1, y1, x2, y2 } = ICON.line;

  const dots = ICON.dots
    .map(
      (dot) =>
        `<circle cx="${px(dot.x)}" cy="${px(dot.y)}" r="${px(ICON.dotRadius)}"/>`,
    )
    .join("");

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${px(ICON.corner)}" fill="${c.background}"/>` +
    `<g fill="${c.dots}">${dots}</g>` +
    `<path d="M${px(x1)} ${px(y1)} L${px(x2)} ${px(y2)}" stroke="${c.line}" stroke-width="${px(ICON.lineWidth)}" stroke-linecap="round"/>` +
    `</svg>`
  );
}
