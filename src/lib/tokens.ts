import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Lê um token de cor do globals.css — a mesma fonte da verdade que o
 * site inteiro usa. Existe porque o gerador de capa (Satori) resolve
 * apenas valores literais: ele não entende `var(--color-accent)`. Sem
 * este leitor, o hex teria de ser reescrito num componente, contra a
 * regra do CLAUDE.md de que cor só existe no @theme.
 *
 * Usa fs — servidor apenas, em tempo de build.
 */
const css = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

export function colorToken(name: string): string {
  const match = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!match) {
    throw new Error(`Token --color-${name} não encontrado em globals.css`);
  }
  return match[1];
}
