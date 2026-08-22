import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="py-(--space-section)">
      <Container>
        <p
          className="hero-rise font-mono text-label uppercase tracking-[0.06em] text-muted"
          style={{ animationDelay: "0ms" }}
        >
          {t("name")}
        </p>

        <h1
          className="hero-rise mt-4 max-w-[20ch] font-display text-display font-semibold leading-[1.1] tracking-tight text-balance"
          style={{ animationDelay: "80ms" }}
        >
          {t("headline")}
        </h1>

        <p
          className="hero-rise mt-6 max-w-(--width-prose) text-muted"
          style={{ animationDelay: "160ms" }}
        >
          {t("paragraph")}
        </p>

        <div
          className="hero-rise mt-10 flex flex-wrap gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Button href="/projetos">{t("ctaProjects")}</Button>
          <Button href="/sobre" variant="secondary">
            {t("ctaCv")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
