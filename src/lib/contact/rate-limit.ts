/**
 * Limite de envio por IP, em memória.
 *
 * LIMITAÇÃO CONHECIDA, e deliberada: serverless não compartilha memória
 * entre instâncias, então isto contém rajada de uma mesma instância, não
 * um ataque distribuído. Para um formulário de portfólio é proporcional
 * — a alternativa (Redis/KV) custa um serviço externo e uma chave a mais
 * para um site que recebe mensagem de recrutador. Se o volume mudar,
 * troque o Map por um store compartilhado; a interface abaixo não muda.
 */
const JANELA_MS = 60 * 60 * 1000;
const MAXIMO = 3;

const registros = new Map<string, number[]>();

export type RateLimitResult = {
  permitido: boolean;
  restantes: number;
  /** Segundos até poder tentar de novo. Só quando bloqueado. */
  esperaSegundos: number;
};

export function checarLimite(
  ip: string,
  agora: number = Date.now(),
): RateLimitResult {
  const recentes = (registros.get(ip) ?? []).filter(
    (momento) => agora - momento < JANELA_MS,
  );

  if (recentes.length >= MAXIMO) {
    const maisAntigo = Math.min(...recentes);
    registros.set(ip, recentes);
    return {
      permitido: false,
      restantes: 0,
      esperaSegundos: Math.ceil((JANELA_MS - (agora - maisAntigo)) / 1000),
    };
  }

  recentes.push(agora);
  registros.set(ip, recentes);

  return {
    permitido: true,
    restantes: MAXIMO - recentes.length,
    esperaSegundos: 0,
  };
}

/** Só para teste: zera o estado entre casos. */
export function limparLimites(): void {
  registros.clear();
}
