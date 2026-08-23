import { useTranslations } from "next-intl";
import { Timeline } from "@/components/sections/Timeline";
import { StackStrip } from "@/components/sections/StackStrip";
import { Container } from "@/components/ui/Container";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <>
      <section className="py-(--space-section)">
        <Container>
          <h1 className="font-display text-h1 font-semibold tracking-tight">
            {t("title")}
          </h1>

          <div className="mt-8 max-w-(--width-prose) space-y-5 text-muted">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p>{t("p4")}</p>
            <p>
              <strong className="font-medium text-foreground">
                {t("outsideLabel")}:
              </strong>{" "}
              {t("outside")}
            </p>
          </div>

          <Timeline />

          <section aria-labelledby="cv-title" className="mt-(--space-block)">
            <h2
              id="cv-title"
              className="font-mono text-label uppercase tracking-[0.06em] text-muted"
            >
              {t("cvTitle")}
            </h2>
            <p className="mt-3 text-muted">{t("cvPending")}</p>
          </section>
        </Container>
      </section>

      <StackStrip />
    </>
  );
}
