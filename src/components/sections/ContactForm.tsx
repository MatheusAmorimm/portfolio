"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

type Estado = "parado" | "enviando" | "enviado" | "erro";

const CODIGOS = ["invalido", "limite", "indisponivel", "falha"] as const;
type Codigo = (typeof CODIGOS)[number];

function ehCodigo(valor: unknown): valor is Codigo {
  return typeof valor === "string" && CODIGOS.includes(valor as Codigo);
}

const CAMPO =
  "w-full rounded-badge border border-border bg-surface px-3 py-2 text-foreground placeholder:text-muted focus-visible:border-border-strong";

/**
 * Formulário de contato. O único componente de cliente do site com
 * estado de verdade.
 *
 * A validação daqui é conveniência: quem valida de fato é o route
 * handler, porque um POST direto ignora este formulário inteiro. Por
 * isso `noValidate` — a mensagem de erro do navegador varia por idioma
 * do sistema, não pelo idioma da página, e o servidor é quem manda.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [estado, setEstado] = useState<Estado>("parado");
  const [codigo, setCodigo] = useState<Codigo>("falha");

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEstado("enviando");

    const dados = new FormData(evento.currentTarget);

    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(dados.get("name") ?? ""),
          email: String(dados.get("email") ?? ""),
          message: String(dados.get("message") ?? ""),
          website: String(dados.get("website") ?? ""),
        }),
      });

      if (resposta.ok) {
        setEstado("enviado");
        return;
      }

      const corpo: unknown = await resposta.json().catch(() => null);
      const recebido =
        corpo && typeof corpo === "object" && "codigo" in corpo
          ? (corpo as { codigo: unknown }).codigo
          : null;

      setCodigo(ehCodigo(recebido) ? recebido : "falha");
      setEstado("erro");
    } catch {
      setCodigo("falha");
      setEstado("erro");
    }
  }

  if (estado === "enviado") {
    return (
      <p
        role="status"
        className="rounded-card border border-border bg-surface p-5 text-foreground"
      >
        {t("sucesso")}
      </p>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="max-w-(--width-prose)">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-muted">
            {t("nome")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className={`mt-2 ${CAMPO}`}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-muted">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            className={`mt-2 ${CAMPO}`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="block text-muted">
          {t("mensagem")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={2000}
          rows={6}
          className={`mt-2 ${CAMPO}`}
        />
      </div>

      {/*
        Honeypot: invisível para gente, irresistível para robô que
        preenche todo input que encontra. `aria-hidden` mais `tabIndex`
        negativo tiram o campo do leitor de tela e do Tab — quem navega
        por teclado nunca esbarra nele.
      */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="inline-flex items-center justify-center rounded-badge bg-accent-strong px-5 py-3 font-medium text-on-accent transition-colors duration-(--duration-hover) hover:bg-accent disabled:opacity-60"
        >
          {estado === "enviando" ? t("enviando") : t("enviar")}
        </button>

        {estado === "erro" ? (
          <p role="alert" className="text-accent">
            {t(`erro.${codigo}`)}
          </p>
        ) : null}
      </div>
    </form>
  );
}
