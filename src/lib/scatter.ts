/**
 * A cena do site: pontos dispersos e a reta que passa por eles.
 *
 * É a imagem mais básica da estatística, e diz o que a frase-âncora do
 * autor diz — dados, e a estrutura que alguém construiu para colocá-los
 * em uso. Aparece na intro, no palco do hero e nas capas dos cases.
 *
 * Tudo aqui é determinístico: a mesma semente produz a mesma cena no
 * servidor e no cliente, em qualquer build. Não há Math.random.
 *
 * Coordenadas em fração da cena (0–1), com y crescendo para baixo como
 * na tela. Quem desenha — SVG ou capa — escala ao próprio tamanho. O
 * raio também é fração da largura, para os pontos crescerem junto.
 *
 * Nenhum número é insinuado: a cena não tem eixo, escala ou rótulo. É
 * forma, não dado.
 */
export type Point = { x: number; y: number; r: number };
export type Line = { x1: number; y1: number; x2: number; y2: number };
export type Scene = { points: Point[]; line: Line };

/** FNV-1a de 32 bits: transforma a semente textual num inteiro. */
function hash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32: PRNG pequeno e determinístico, suficiente para desenho. */
function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/**
 * Ajuste por mínimos quadrados ordinários, y = a + b·x, devolvido como
 * a reta que atravessa a cena de x = 0 a x = 1.
 *
 * Quando x não varia a inclinação é indefinida; devolve a horizontal na
 * média de y em vez de dividir por zero.
 */
export function fitLine(points: Point[]): Line {
  const n = points.length;
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;

  let sxx = 0;
  let sxy = 0;
  for (const { x, y } of points) {
    sxx += (x - meanX) ** 2;
    sxy += (x - meanX) * (y - meanY);
  }

  const slope = sxx === 0 ? 0 : sxy / sxx;
  const intercept = meanY - slope * meanX;

  return { x1: 0, y1: intercept, x2: 1, y2: intercept + slope };
}

export function scatter(seed: string, count = 36): Scene {
  const rand = mulberry32(hash(seed));

  // A tendência sobe da esquerda para a direita (inclinação negativa em
  // coordenadas de tela) e cruza o meio da cena. Ruído moderado: os
  // pontos precisam parecer dados, não uma reta pontilhada.
  const slope = -(0.3 + rand() * 0.25);
  const middle = 0.46 + rand() * 0.1;
  const noise = 0.07 + rand() * 0.04;

  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const x = 0.06 + rand() * 0.88;
    // Soma de três uniformes: aproximação barata de uma normal.
    const gauss = (rand() + rand() + rand() - 1.5) * 2;
    const y = clamp(middle + slope * (x - 0.5) + gauss * noise, 0.08, 0.92);
    const r = 0.005 + rand() * 0.003;
    points.push({ x: round(x), y: round(y), r: round(r) });
  }

  return { points, line: fitLine(points) };
}
