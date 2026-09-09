import { useTranslations } from "next-intl";
import { ScatterStage } from "@/components/sections/ScatterStage";
import { Container } from "@/components/ui/Container";

/** Semente compartilhada com o hero: a cortina sobe e a mesma cena está lá. */
export const HERO_SEED = "matheus-amorim";

/**
 * O que a cortina mostra: a cena e, embaixo dela, nome e frase-âncora.
 * Mesma grade e mesmo container do hero, para o nome da cortina estar
 * no lugar exato em que o nome do hero vai aparecer quando ela subir.
 *
 * Server Component passado como `children` ao <Intro>, que é de
 * cliente — o SVG e o texto vão prontos no HTML.
 */
export function IntroScene() {
  const t = useTranslations("hero");

  return (
    <div className="grade relative min-h-svh">
      <Container className="relative z-10 grid min-h-svh grid-cols-1 content-center gap-10 py-(--space-block) lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <p
            className="hero-rise font-mono text-label uppercase tracking-[0.06em] text-accent-cool"
            style={{ animationDelay: "900ms" }}
          >
            {t("name")}
          </p>
          <p
            className="hero-rise mt-4 max-w-[20ch] font-display text-display font-semibold leading-[1.1] tracking-tight text-balance"
            style={{ animationDelay: "1050ms" }}
          >
            {t("headline")}
          </p>
        </div>

        <ScatterStage
          seed={HERO_SEED}
          className="scene mx-auto w-full max-w-136 lg:max-w-none"
        />
      </Container>
    </div>
  );
}
