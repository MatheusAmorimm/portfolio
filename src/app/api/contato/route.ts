import { NextResponse } from "next/server";
import { criarLimitador, ipDe } from "@/lib/contact/rate-limit";
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

const limite = criarLimitador({ maximo: 3 });

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

  const resultado = limite.checar(ipDe(request));
  if (!resultado.permitido) {
    return NextResponse.json(
      { ok: false, codigo: "limite", esperaSegundos: resultado.esperaSegundos },
      {
        status: 429,
        headers: { "Retry-After": String(resultado.esperaSegundos) },
      },
    );
  }

  const envio = await enviarMensagem(parsed.data);
  if (!envio.ok) {
    return envio.motivo === "nao-configurado"
      ? erro("indisponivel", 503)
      : erro("falha", 502);
  }

  return NextResponse.json({ ok: true });
}
