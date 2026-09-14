import { useLocale, useTranslations } from "next-intl";
import { HERO_SEED } from "@/components/sections/IntroScene";
import { ScatterStage } from "@/components/sections/ScatterStage";
import { CvButton } from "@/components/sections/CvButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CV } from "@/lib/cv";

/**
 * Hero em duas colunas a partir de `lg`: o texto e, à direita, a cena —
 * os mesmos pontos e a mesma reta da cortina, com a mesma semente. A
 * cortina sobe e a cena está lá, se desenhando de novo.
 *
 * A cena espera a cortina (`.hero .scene`, globals.css); o texto NÃO.
 * Ele nasce em 0 ms por baixo da cortina, como sempre, porque é ele que
 * carrega o LCP.
 */
export function Hero() {
  const t = useTranslations("hero");
  const tCv = useTranslations("cv");
  const locale = useLocale();
  const cv = CV[locale];

  return (
    <section className="hero grade relative overflow-hidden">
      <Container className="relative z-10 grid grid-cols-1 gap-12 py-(--space-block) lg:min-h-[min(calc(100svh-4rem),56rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <p
            className="hero-rise font-mono text-label uppercase tracking-[0.06em] text-accent-cool"
            style={{ animationDelay: "0ms" }}
          >
            {t("name")}
          </p>

          {/*
            Headline e parágrafo entram SEM atraso. Com `fill-mode:
            backwards` qualquer atraso os mantém em opacity 0, e o Chrome
            não considera candidato a LCP o que está invisível — medido
            pelo Lighthouse, o elemento de LCP da home é o parágrafo, não
            o título. A cascata sobrevive nos CTAs, que ninguém mede.
          */}
          <h1
            className="hero-rise mt-4 max-w-[20ch] font-display text-display font-semibold leading-[1.1] tracking-tight text-balance"
            style={{ animationDelay: "0ms" }}
          >
            {t("headline")}
          </h1>

          <p
            className="hero-rise mt-6 max-w-(--width-prose) text-muted"
            style={{ animationDelay: "0ms" }}
          >
            {t("paragraph")}
          </p>

          <div
            className="hero-rise mt-10 flex flex-wrap gap-3"
            style={{ animationDelay: "120ms" }}
          >
            <Button href="/projetos">{t("ctaProjects")}</Button>
            {/*
              Sem currículo neste idioma, o CTA leva para /sobre, onde a
              seção de currículo explica a ausência — melhor que um botão
              de download que daria 404.
            */}
            {cv ? (
              <CvButton
                href={cv}
                label={t("ctaCv")}
                thanks={tCv("thanks")}
                locale={locale}
                origem="hero"
              />
            ) : (
              <Button href="/sobre" variant="secondary">
                {t("ctaCv")}
              </Button>
            )}
          </div>
        </div>

        <ScatterStage
          seed={HERO_SEED}
          className="scene mx-auto w-full max-w-136 lg:max-w-none"
        />
      </Container>
    </section>
  );
}
