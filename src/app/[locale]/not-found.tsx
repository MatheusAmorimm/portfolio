import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="py-(--space-section)">
      <Container>
        <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
          404
        </p>
        <h1 className="hero-rise mt-4 max-w-[20ch] font-display text-display font-semibold leading-[1.1] tracking-tight text-balance">
          {t("titulo")}
        </h1>
        <p className="mt-6 max-w-(--width-prose) text-muted">{t("texto")}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/">{t("home")}</Button>
          <Button href="/projetos" variant="secondary">
            {t("projetos")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
