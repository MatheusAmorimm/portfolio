import { SOCIAL } from "@/lib/social";
import { descreverDownload, type DownloadInput } from "@/lib/cv";
import type { ContactInput } from "./schema";

/**
 * Envio pela API da Resend, por `fetch` — sem SDK.
 *
 * A chamada é um POST com JSON; o pacote oficial resolveria as mesmas
 * quinze linhas ao custo de mais uma dependência, e a regra do projeto é
 * medir o custo antes de adicionar biblioteca. Roda só no servidor.
 *
 * Configuração:
 *   RESEND_API_KEY      obrigatória
 *   CONTACT_TO_EMAIL    destino; sem ela, cai no e-mail público do autor
 *   CONTACT_FROM_EMAIL  remetente; sem domínio verificado, a Resend só
 *                       aceita `onboarding@resend.dev` e só entrega para
 *                       o e-mail dono da conta — que é exatamente o caso
 *                       aqui até o domínio próprio existir.
 */
const ENDPOINT = "https://api.resend.com/emails";

export type SendResult =
  | { ok: true }
  | { ok: false; motivo: "nao-configurado" | "falha-provedor" };

type Email = {
  assunto: string;
  texto: string;
  /** Responder no cliente de e-mail vai para este endereço. */
  responderPara?: string;
};

async function enviarEmail(email: Email): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, motivo: "nao-configurado" };
  }

  const destino = process.env.CONTACT_TO_EMAIL ?? SOCIAL.email;
  const remetente = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  const resposta = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Portfólio <${remetente}>`,
      to: [destino],
      ...(email.responderPara ? { reply_to: email.responderPara } : {}),
      subject: email.assunto,
      text: email.texto,
    }),
  });

  if (!resposta.ok) {
    // O corpo da resposta pode conter o e-mail e a mensagem enviados; em
    // produção nada disso é logado (CLAUDE.md, "Segurança"). Só o status.
    if (process.env.NODE_ENV !== "production") {
      console.error("Resend respondeu", resposta.status, await resposta.text());
    } else {
      console.error("Falha ao enviar e-mail: status", resposta.status);
    }
    return { ok: false, motivo: "falha-provedor" };
  }

  return { ok: true };
}

/** Mensagem do formulário de contato, com reply-to em quem escreveu. */
export function enviarMensagem(entrada: ContactInput): Promise<SendResult> {
  return enviarEmail({
    assunto: `Contato pelo site — ${entrada.name}`,
    responderPara: entrada.email,
    texto: [
      `Nome:  ${entrada.name}`,
      `E-mail: ${entrada.email}`,
      "",
      entrada.message,
    ].join("\n"),
  });
}

/**
 * Aviso ao autor de que alguém baixou o currículo. Só o que o site sabe
 * sem identificar ninguém: idioma, botão e horário. Nada de IP nem de
 * user agent — é um aviso, não rastreamento.
 */
export function notificarDownloadCurriculo(
  entrada: DownloadInput,
): Promise<SendResult> {
  return enviarEmail({
    assunto: "Alguém baixou o seu currículo pelo site",
    texto: descreverDownload(entrada, new Date()),
  });
}
