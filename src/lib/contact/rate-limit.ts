/**
 * Limite de requisições por IP, em memória.
 *
 * LIMITAÇÃO CONHECIDA, e deliberada: serverless não compartilha memória
 * entre instâncias, então isto contém rajada de uma mesma instância, não
 * um ataque distribuído. Para um formulário de portfólio é proporcional
 * — a alternativa (Redis/KV) custa um serviço externo e uma chave a mais
 * para um site que recebe mensagem de recrutador. Se o volume mudar,
 * troque o Map por um store compartilhado; a interface abaixo não muda.
 *
 * Cada rota cria o próprio limitador: o contato e o aviso de download do
 * currículo têm contadores separados, senão baixar o currículo gastaria
 * as tentativas do formulário.
 */
export type RateLimitResult = {
  permitido: boolean;
  restantes: number;
  /** Segundos até poder tentar de novo. Só quando bloqueado. */
  esperaSegundos: number;
};

export type Limitador = {
  checar: (ip: string, agora?: number) => RateLimitResult;
  /** Só para teste: zera o estado entre casos. */
  limpar: () => void;
};

export const UMA_HORA_MS = 60 * 60 * 1000;

export function criarLimitador({
  maximo,
  janelaMs = UMA_HORA_MS,
}: {
  maximo: number;
  janelaMs?: number;
}): Limitador {
  const registros = new Map<string, number[]>();

  return {
    checar(ip, agora = Date.now()) {
      const recentes = (registros.get(ip) ?? []).filter(
        (momento) => agora - momento < janelaMs,
      );

      if (recentes.length >= maximo) {
        const maisAntigo = Math.min(...recentes);
        registros.set(ip, recentes);
        return {
          permitido: false,
          restantes: 0,
          esperaSegundos: Math.ceil((janelaMs - (agora - maisAntigo)) / 1000),
        };
      }

      recentes.push(agora);
      registros.set(ip, recentes);

      return {
        permitido: true,
        restantes: maximo - recentes.length,
        esperaSegundos: 0,
      };
    },
    limpar() {
      registros.clear();
    },
  };
}

/**
 * Atrás da Vercel, o IP do visitante é o primeiro de x-forwarded-for;
 * request.ip não existe fora do runtime edge.
 */
export function ipDe(request: Request): string {
  const encaminhado = request.headers.get("x-forwarded-for") ?? "";
  return encaminhado.split(",")[0]?.trim() || "desconhecido";
}
