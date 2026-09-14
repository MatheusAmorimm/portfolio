import type { Locale } from "next-intl";
import { z } from "zod";

/**
 * Currículo publicado, por idioma. Caminho a partir de `public/`.
 *
 * `null` significa que não há arquivo para aquele idioma: a interface
 * mostra um aviso, nunca um botão que daria 404. Hoje os dois idiomas
 * têm PDF; o inglês foi gerado em 13/09/2026 a partir do original em PT.
 *
 * A versão publicada é a SEM endereço e SEM telefone (CLAUDE.md,
 * "Segurança"). Confira o conteúdo antes de trocar o arquivo — o Git
 * guarda todas as versões, e remover depois não apaga o histórico.
 */
export const CV: Record<Locale, string | null> = {
  pt: "/cv-matheus-amorim-pt.pdf",
  en: "/cv-matheus-amorim-en.pdf",
};

/**
 * O que o botão de download manda para `/api/curriculo`: só o idioma e
 * qual botão foi clicado. Validado no servidor, como todo POST.
 */
export const downloadSchema = z.strictObject({
  locale: z.enum(["pt", "en"]),
  origem: z.enum(["hero", "sobre"]),
});

export type DownloadInput = z.infer<typeof downloadSchema>;

const IDIOMA: Record<DownloadInput["locale"], string> = {
  pt: "português",
  en: "inglês",
};

const ORIGEM: Record<DownloadInput["origem"], string> = {
  hero: "botão do topo da home",
  sobre: "página Sobre",
};

/** Corpo do e-mail de aviso, em texto simples, no horário de Brasília. */
export function descreverDownload(
  entrada: DownloadInput,
  agora: Date,
): string {
  const quando = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(agora);

  return [
    "Alguém baixou o currículo pelo site.",
    "",
    `Quando:  ${quando} (horário de Brasília)`,
    `Idioma:  ${IDIOMA[entrada.locale]}`,
    `Onde:    ${ORIGEM[entrada.origem]}`,
  ].join("\n");
}
