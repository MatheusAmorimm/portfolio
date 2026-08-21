"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("label")}>
      {routing.locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-current={option === locale ? "true" : undefined}
          onClick={() =>
            router.replace(
              // @ts-expect-error -- next-intl valida em tempo de tipo que
              // `params` corresponde ao `pathname`; como os dois sempre
              // descrevem a rota atual, a checagem estática é dispensável
              // aqui (padrão documentado do next-intl para pathnames com
              // segmentos dinâmicos).
              { pathname, params },
              { locale: option },
            )
          }
          className={`rounded-badge px-2 py-1 font-mono text-label uppercase tracking-[0.06em] transition-colors duration-(--duration-hover) ${
            option === locale
              ? "text-accent"
              : "text-muted hover:text-foreground"
          }`}
        >
          {option}
          <span className="sr-only"> — {t(option)}</span>
        </button>
      ))}
    </div>
  );
}
