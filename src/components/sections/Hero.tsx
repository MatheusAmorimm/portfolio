import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CV } from "@/lib/cv";

export function Hero() {
  const t = useTranslations("hero");
  const cv = CV[useLocale()];

  return (
    <section className="py-(--space-section)">
      <Container>
        <p
          className="hero-rise font-mono text-label uppercase tracking-[0.06em] text-muted"
          style={{ animationDelay: "0ms" }}
        >
          {t("name")}
        </p>

        {/*
          A headline entra SEM atraso porque é ela o elemento de LCP da
          home. Com `fill-mode: backwards`, qualquer atraso a mantém em
          opacity 0 — e o Chrome não considera candidato a LCP o que está
          invisível, então cada milissegundo de atraso aqui é somado à
          métrica. A cascata continua existindo nos elementos abaixo.
        */}
        <h1
          className="hero-rise mt-4 max-w-[20ch] font-display text-display font-semibold leading-[1.1] tracking-tight text-balance"
          style={{ animationDelay: "0ms" }}
        >
          {t("headline")}
        </h1>

        <p
          className="hero-rise mt-6 max-w-(--width-prose) text-muted"
          style={{ animationDelay: "80ms" }}
        >
          {t("paragraph")}
        </p>

        <div
          className="hero-rise mt-10 flex flex-wrap gap-3"
          style={{ animationDelay: "160ms" }}
        >
          <Button href="/projetos">{t("ctaProjects")}</Button>
          {/*
            Sem currículo neste idioma, o CTA leva para /sobre, onde a
            seção de currículo explica a ausência — melhor que um botão
            de download que daria 404.
          */}
          {cv ? (
            <Button href={cv} variant="secondary" external>
              {t("ctaCv")}
            </Button>
          ) : (
            <Button href="/sobre" variant="secondary">
              {t("ctaCv")}
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
