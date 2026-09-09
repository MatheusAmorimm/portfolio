"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type AnimationEvent,
  type ReactNode,
} from "react";

const CHAVE_SESSAO = "intro-vista";

/*
 * Roda ANTES de a cortina ser pintada: é um script inline síncrono,
 * emitido logo antes dela no HTML. Se a intro já foi vista nesta aba,
 * marca o <html> e o CSS esconde a cortina no primeiro quadro — sem
 * flash. Sem sessionStorage (modo privado que bloqueia), a intro roda
 * toda vez, que é o comportamento seguro.
 */
const VERIFICACAO = `try{if(sessionStorage.getItem("${CHAVE_SESSAO}"))document.documentElement.dataset.intro="skip"}catch{}`;

function jaVista(): boolean {
  try {
    return sessionStorage.getItem(CHAVE_SESSAO) !== null;
  } catch {
    return false;
  }
}

function lembrar() {
  try {
    sessionStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    // Sem armazenamento, a intro simplesmente roda de novo na próxima.
  }
  document.documentElement.dataset.intro = "skip";
}

type Props = {
  /** A cena e o texto, renderizados no servidor. Ficam em aria-hidden. */
  children: ReactNode;
  skipLabel: string;
};

/**
 * Cortina da intro: cobre a tela na primeira visita da sessão, mostra a
 * cena e sobe. Toda a coreografia é CSS (globals.css, `.intro`); este
 * componente só cuida do que precisa de JavaScript — pular, lembrar e
 * desmontar.
 *
 * Interrompível de três jeitos: o botão, a tecla Esc e clique em
 * qualquer ponto. Pular marca `data-intro="skip"` no <html>, e o CSS
 * responde na hora, antes mesmo de o React renderizar de novo.
 *
 * Acessibilidade: a cena e o texto duplicam o hero e por isso ficam em
 * `aria-hidden`; o botão fica FORA desse nó e recebe o foco ao montar,
 * então é o primeiro elemento que teclado e leitor de tela encontram.
 * Quando a cortina termina, o componente desmonta e nada dela sobra na
 * árvore.
 */
export function Intro({ children, skipLabel }: Props) {
  const [encerrada, setEncerrada] = useState(false);

  const encerrar = useCallback(() => {
    lembrar();
    setEncerrada(true);
  }, []);

  // Navegação de cliente de volta à home: o React não executa o script
  // inline, então a verificação é refeita aqui — antes da pintura, para
  // não piscar. Só marca o <html>; o CSS faz o resto.
  useLayoutEffect(() => {
    if (jaVista()) {
      document.documentElement.dataset.intro = "skip";
    }
  }, []);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        encerrar();
      }
    }

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [encerrar]);

  function aoTerminarAnimacao(evento: AnimationEvent<HTMLDivElement>) {
    // Os pontos e a reta também disparam animationend; só a subida da
    // cortina encerra a intro.
    if (evento.animationName === "intro-lift") {
      encerrar();
    }
  }

  if (encerrada) {
    return null;
  }

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: VERIFICACAO }} />
      <div
        className="intro"
        onClick={encerrar}
        onAnimationEnd={aoTerminarAnimacao}
      >
        <div aria-hidden="true" className="relative z-10">
          {children}
        </div>
        {/*
          Foco inicial no botão: o header (com o link de pular para o
          conteúdo) vem antes na árvore e está por baixo da cortina. Sem
          isto, o primeiro Tab caía num link invisível. Para leitor de
          tela, o efeito é anunciar "Pular introdução, botão" — que é
          exatamente a informação de que a cortina existe e como sair.
        */}
        <button
          type="button"
          autoFocus
          onClick={encerrar}
          className="absolute right-(--space-gutter) bottom-8 z-20 inline-flex min-h-11 items-center border-b border-border px-3 font-mono text-label uppercase tracking-[0.06em] text-muted transition-colors duration-(--duration-hover) hover:border-accent hover:text-foreground"
        >
          {skipLabel}
        </button>
      </div>
    </>
  );
}
