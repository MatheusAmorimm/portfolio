import { SOCIAL } from "@/lib/social";
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

export async function enviarMensagem(
  entrada: ContactInput,
): Promise<SendResult> {
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
      // Responder no cliente de e-mail vai direto para quem escreveu.
      reply_to: entrada.email,
      subject: `Contato pelo site — ${entrada.name}`,
      text: [
        `Nome:  ${entrada.name}`,
        `E-mail: ${entrada.email}`,
        "",
        entrada.message,
      ].join("\n"),
    }),
  });

  if (!resposta.ok) {
    // O corpo da resposta pode conter o e-mail e a mensagem enviados; em
    // produção nada disso é logado (CLAUDE.md, "Segurança"). Só o status.
    if (process.env.NODE_ENV !== "production") {
      console.error("Resend respondeu", resposta.status, await resposta.text());
    } else {
      console.error("Falha ao enviar contato: status", resposta.status);
    }
    return { ok: false, motivo: "falha-provedor" };
  }

  return { ok: true };
}
