"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { DownloadInput } from "@/lib/cv";

type Props = DownloadInput & {
  href: string;
  label: string;
  /** Texto do agradecimento. Vem traduzido do componente de servidor. */
  thanks: string;
};

/** Tempo que o agradecimento fica na tela. */
const DURACAO_MS = 6000;

/**
 * Botão de download do currículo. Abre o PDF em nova aba, agradece na
 * aba que ficou e avisa o autor por e-mail via `/api/curriculo`.
 *
 * O aviso é `fetch` com `keepalive`: sai mesmo que a pessoa feche a aba
 * logo depois. A resposta é ignorada de propósito — o agradecimento
 * aparece de qualquer jeito, porque o download já aconteceu; e-mail que
 * não sai é problema do autor, não do visitante.
 *
 * `role="status"` faz o leitor de tela anunciar o texto sem roubar o
 * foco. A entrada reaproveita `card-rise`, então respeita o bloco de
 * `prefers-reduced-motion` do globals.css como todo o resto.
 */
export function CvButton({ href, label, thanks, locale, origem }: Props) {
  const [agradecendo, setAgradecendo] = useState(false);

  useEffect(() => {
    if (!agradecendo) {
      return;
    }
    const timer = setTimeout(() => setAgradecendo(false), DURACAO_MS);
    return () => clearTimeout(timer);
  }, [agradecendo]);

  function avisar() {
    setAgradecendo(true);
    fetch("/api/curriculo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale, origem } satisfies DownloadInput),
      keepalive: true,
    }).catch(() => {
      // Sem rede ou sem servidor: o PDF já abriu, nada a fazer.
    });
  }

  return (
    <>
      <Button href={href} variant="secondary" external newTab onClick={avisar}>
        {label}
      </Button>
      {agradecendo ? (
        <p
          role="status"
          className="card-rise fixed inset-x-4 bottom-6 z-50 mx-auto w-fit max-w-full rounded-card border border-border bg-surface px-5 py-3 text-foreground shadow-lg"
        >
          {thanks}
        </p>
      ) : null}
    </>
  );
}
