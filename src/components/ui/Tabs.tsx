"use client";

import { AnimatePresence, LazyMotion, m, useReducedMotion } from "motion/react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { DEFAULT_TAB, type TabId } from "@/lib/tabs";

const loadFeatures = () =>
  import("@/components/motion/features").then((mod) => mod.default);

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
 * A troca usa `AnimatePresence mode="wait"`: a saída termina antes da
 * entrada começar. É o caso em que CSS puro fica frágil — não há como
 * animar a saída de um elemento que já foi desmontado.
 */
export function Tabs({ tabs, initial }: Props) {
  const [active, setActive] = useState<TabId>(initial);
  const router = useRouter();
  const reduced = useReducedMotion();
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

      <LazyMotion features={loadFeatures} strict>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active}
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{
              duration: reduced ? 0 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-(--space-block)"
          >
            {panel?.panel}
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </>
  );
}
