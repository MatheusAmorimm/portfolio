import { NextResponse } from "next/server";
import { criarLimitador, ipDe } from "@/lib/contact/rate-limit";
import { notificarDownloadCurriculo } from "@/lib/contact/send";
import { downloadSchema } from "@/lib/cv";

/**
 * Aviso de download do currículo. O botão dispara este POST ao ser
 * clicado; o servidor manda um e-mail ao autor.
 *
 * O download em si não passa por aqui — o PDF é arquivo estático, e
 * quem abrir a URL direto não avisa ninguém. É o clique que conta, e é
 * o que o autor quer saber: alguém lendo o site chegou ao currículo.
 *
 * Limite por IP mais apertado que o do contato: um clique por hora já
 * cobre o uso real, e o resto é gente segurando o botão ou robô.
 */
const limite = criarLimitador({ maximo: 2 });

export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = downloadSchema.safeParse(corpo);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!limite.checar(ipDe(request)).permitido) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const envio = await notificarDownloadCurriculo(parsed.data);
  // Sem chave da Resend o aviso não sai, e tudo bem: o botão do cliente
  // não depende desta resposta para abrir o PDF nem para agradecer.
  return NextResponse.json({ ok: envio.ok }, { status: envio.ok ? 200 : 503 });
}
