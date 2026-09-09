/**
 * Contraste WCAG 2.1. Usado pelo teste da paleta para garantir que
 * nenhuma combinação de tokens caia abaixo de AA.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

const HEX = /^#?([0-9a-f]{6})$/i;

export function hexToRgb(hex: string): [number, number, number] {
  const match = HEX.exec(hex.trim());
  if (!match) {
    throw new Error(`Hex inválido: ${hex}`);
  }
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Cor resultante de pintar `over` com opacidade `alpha` sobre `under`,
 * em sRGB — o que o navegador faz ao compor um degradê translúcido
 * sobre o fundo. Serve para medir contraste no ponto mais claro dos
 * brilhos do fundo, em vez de estimar à mão.
 */
export function composite(over: string, under: string, alpha: number): string {
  const top = hexToRgb(over);
  const base = hexToRgb(under);
  const channels = base.map((b, i) => Math.round(b * (1 - alpha) + top[i] * alpha));
  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
