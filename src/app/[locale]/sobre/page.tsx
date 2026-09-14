import { hasLocale, useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { CAMINHOS } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";
import { CvButton } from "@/components/sections/CvButton";
import { Timeline } from "@/components/sections/Timeline";
import { StackStrip } from "@/components/sections/StackStrip";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CV } from "@/lib/cv";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/sobre">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "about" });
  const caminhos = CAMINHOS["/sobre"];

  return {
    title: t("title"),
    alternates: {
      canonical: caminhos[locale],
      languages: { "pt-BR": caminhos.pt, "en-US": caminhos.en },
    },
  };
}

export default function AboutPage() {
  const t = useTranslations("about");
  const tCv = useTranslations("cv");
  const locale = useLocale();
  const cv = CV[locale];

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
            <p>
              <strong className="font-medium text-foreground">
                {t("outsideLabel")}:
              </strong>{" "}
              {t("outside")}
            </p>
          </div>

          <Reveal>
            <Timeline />
          </Reveal>

          <section aria-labelledby="cv-title" className="mt-(--space-block)">
            <SectionTitle id="cv-title">{t("cvTitle")}</SectionTitle>
            {cv ? (
              <div className="mt-6">
                <CvButton
                  href={cv}
                  label={t("cvDownload")}
                  thanks={tCv("thanks")}
                  locale={locale}
                  origem="sobre"
                />
              </div>
            ) : (
              <p className="mt-3 text-muted">{t("cvPending")}</p>
            )}
          </section>
        </Container>
      </section>

      <StackStrip />
    </>
  );
}
