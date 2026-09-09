import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DISPLAY_NAME } from "@/lib/social";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NavLink } from "./NavLink";

/**
 * Header fixo no topo, translúcido sobre o que rola por baixo. A rota
 * atual fica marcada pelo <NavLink> — antes o site não dizia onde o
 * visitante estava.
 */
export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded-badge focus:bg-surface focus:px-3 focus:py-2"
      >
        {t("skipToContent")}
      </a>
      {/*
        `flex-wrap`: em tela estreita, o seletor de idioma desce para uma
        segunda linha (e vai para a direita pelo `ml-auto`) em vez de
        espremer a marca em duas linhas.
      */}
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4">
        <Link
          href="/"
          className="font-mono text-label uppercase tracking-[0.06em] whitespace-nowrap"
        >
          {DISPLAY_NAME}
        </Link>
        <nav aria-label={t("mainNavigation")}>
          <ul className="flex items-center gap-5">
            <li>
              <NavLink href="/projetos">{t("projects")}</NavLink>
            </li>
            <li>
              <NavLink href="/sobre">{t("about")}</NavLink>
            </li>
            <li>
              <NavLink href="/contato">{t("contact")}</NavLink>
            </li>
          </ul>
        </nav>
        <div className="ml-auto">
          <LocaleSwitcher />
        </div>
      </Container>
    </header>
  );
}
