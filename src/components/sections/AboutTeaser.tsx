import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";

export function AboutTeaser() {
  const t = useTranslations("about");

  return (
    <section
      className="border-t border-border py-(--space-block)"
      aria-labelledby="about-teaser-title"
    >
      <Container>
        <h2
          id="about-teaser-title"
          className="font-mono text-label uppercase tracking-[0.06em] text-muted"
        >
          {t("title")}
        </h2>
        <p className="mt-6 max-w-(--width-prose) text-muted">{t("p3")}</p>
        <Link
          href="/sobre"
          className="mt-6 inline-block text-accent underline-offset-4 hover:underline"
        >
          {t("readMore")}
        </Link>
      </Container>
    </section>
  );
}
