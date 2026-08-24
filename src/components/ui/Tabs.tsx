"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { DEFAULT_TAB, type TabId } from "@/lib/tabs";

type Tab = { id: TabId; label: string; panel: ReactNode };

type Props = {
  tabs: Tab[];
  /** Aba lida da URL no servidor; vira o estado inicial. */
  initial: TabId;
};

/**
 * Abas com o padrão ARIA completo: `tablist`/`tab`/`tabpanel`,
 * `aria-selected`, `aria-controls` e tabindex móvel — só a aba ativa
 * entra na ordem de tabulação, e as setas percorrem as demais, com
 * volta ao início. É o comportamento que um leitor de tela espera.
 *
 * O estado espelha na URL (`?tab=web`) por `router.replace` com
 * `scroll: false`, então a aba sobrevive a recarga e a link
 * compartilhado sem dar salto na página.
 *
 * A troca de aba usa a MESMA entrada das seções que aparecem ao rolar:
 * o painel carrega `key={active}`, então React o remonta a cada troca e
 * a animação de CSS roda de novo. Não há animação de saída — o painel
 * antigo some na hora e o novo entra. Foi uma escolha: a versão com
 * saída dependia da biblioteca de animação, que custava 46 KB gzip
 * nesta página, e a entrada é o que o autor pediu para destacar.
 */
export function Tabs({ tabs, initial }: Props) {
  const [active, setActive] = useState<TabId>(initial);
  const router = useRouter();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function select(id: TabId) {
    setActive(id);
    router.replace(
      // Rota fixa em vez de `usePathname()`: o hook devolve a união de
      // todas as rotas, e `/projetos/[slug]` exige `params` — o tipo não
      // fecha. Estas abas existem só na página de Projetos.
      //
      // A aba padrão sai da URL: /projetos é mais limpo que
      // /projetos?tab=dados-ia e leva ao mesmo lugar.
      { pathname: "/projetos", query: id === DEFAULT_TAB ? {} : { tab: id } },
      { scroll: false },
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const target = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (target === undefined) {
      return;
    }

    event.preventDefault();
    const tab = tabs[target];
    setActive(tab.id);
    select(tab.id);
    refs.current[target]?.focus();
  }

  const panel = tabs.find((tab) => tab.id === active);

  return (
    <>
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto border-b border-border"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`-mb-px shrink-0 border-b-2 px-4 py-3 font-mono text-label uppercase tracking-[0.06em] transition-colors duration-(--duration-hover) ${
                selected
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        // `key` é o mecanismo da animação: trocar de aba remonta o
        // painel, e a animação de CSS `card-rise` roda outra vez.
        key={active}
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        // O painel entra na ordem de tabulação porque pode não ter
        // nenhum elemento focável dentro — é o caso da aba sem projetos
        // publicados, que hoje só tem um parágrafo. Sem isto, o Tab pula
        // do seletor de abas direto para o rodapé e quem navega por
        // teclado nunca lê o painel.
        tabIndex={0}
        className="card-rise mt-(--space-block)"
      >
        {panel?.panel}
      </div>
    </>
  );
}
