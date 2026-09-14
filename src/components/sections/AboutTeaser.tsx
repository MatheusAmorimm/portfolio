import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Link } from "@/i18n/navigation";

export function AboutTeaser() {
  const t = useTranslations("about");

  return (
    <section
      className="border-t border-border py-(--space-block)"
      aria-labelledby="about-teaser-title"
    >
      <Container>
        <Reveal>
          <SectionTitle id="about-teaser-title">{t("title")}</SectionTitle>
          <p className="mt-6 max-w-(--width-prose) text-muted">{t("p1")}</p>
          <Link
            href="/sobre"
            className="mt-6 inline-block text-accent underline-offset-4 hover:underline"
          >
            {t("readMore")}
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
