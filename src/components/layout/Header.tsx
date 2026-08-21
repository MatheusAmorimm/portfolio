import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DISPLAY_NAME } from "@/lib/social";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="border-b border-border">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded-badge focus:bg-surface focus:px-3 focus:py-2"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex w-full max-w-(--width-container) items-center justify-between gap-6 px-(--space-gutter) py-4">
        <Link
          href="/"
          className="font-mono text-label uppercase tracking-[0.06em]"
        >
          {DISPLAY_NAME}
        </Link>
        <nav aria-label={t("projects")}>
          <ul className="flex items-center gap-5">
            <li>
              <Link
                href="/projetos"
                className="text-muted transition-colors duration-(--duration-hover) hover:text-foreground"
              >
                {t("projects")}
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className="text-muted transition-colors duration-(--duration-hover) hover:text-foreground"
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="text-muted transition-colors duration-(--duration-hover) hover:text-foreground"
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>
        <LocaleSwitcher />
      </div>
    </header>
  );
}
