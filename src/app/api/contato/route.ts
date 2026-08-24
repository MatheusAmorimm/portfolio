import { NextResponse } from "next/server";
import { checarLimite } from "@/lib/contact/rate-limit";
import { contactSchema } from "@/lib/contact/schema";
import { enviarMensagem } from "@/lib/contact/send";

/**
 * Recebe o formulário de contato.
 *
 * Ordem das barreiras, da mais barata para a mais cara: honeypot (dentro
 * do schema) → validação → limite por IP → envio. Nada de conteúdo
 * submetido por usuário vai para log em produção.
 *
 * Fora de `[locale]` de propósito: o proxy de i18n já ignora /api, e a
 * rota não tem nada de traduzível — as mensagens de erro voltam como
 * código, e é o cliente que decide o texto no idioma da página.
 */
export type ContactErrorCode =
  | "invalido"
  | "limite"
  | "indisponivel"
  | "falha";

function erro(codigo: ContactErrorCode, status: number) {
  return NextResponse.json({ ok: false, codigo }, { status });
}

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro("invalido", 400);
  }

  const parsed = contactSchema.safeParse(corpo);
  if (!parsed.success) {
    // Honeypot preenchido cai aqui junto com erro de validação real, e
    // isso é intencional: o robô não recebe pista de qual campo o traiu.
    return erro("invalido", 400);
  }

  // Atrás da Vercel, o IP do visitante é o primeiro de x-forwarded-for;
  // request.ip não existe fora do runtime edge.
  const encaminhado = request.headers.get("x-forwarded-for") ?? "";
  const ip = encaminhado.split(",")[0]?.trim() || "desconhecido";

  const limite = checarLimite(ip);
  if (!limite.permitido) {
    return NextResponse.json(
      { ok: false, codigo: "limite", esperaSegundos: limite.esperaSegundos },
      { status: 429, headers: { "Retry-After": String(limite.esperaSegundos) } },
    );
  }

  const resultado = await enviarMensagem(parsed.data);
  if (!resultado.ok) {
    return resultado.motivo === "nao-configurado"
      ? erro("indisponivel", 503)
      : erro("falha", 502);
  }

  return NextResponse.json({ ok: true });
}
