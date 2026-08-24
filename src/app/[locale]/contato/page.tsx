import { hasLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { CAMINHOS } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SOCIAL } from "@/lib/social";

const LINKS = [
  { key: "github", href: SOCIAL.github },
  { key: "linkedin", href: SOCIAL.linkedin },
  { key: "email", href: `mailto:${SOCIAL.email}` },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contato">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "contact" });
  const caminhos = CAMINHOS["/contato"];

  return {
    title: t("titulo"),
    alternates: {
      canonical: caminhos[locale],
      languages: { "pt-BR": caminhos.pt, "en-US": caminhos.en },
    },
  };
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const social = useTranslations("social");

  return (
    <section className="py-(--space-section)">
      <Container>
        <h1 className="font-display text-h1 font-semibold tracking-tight">
          {t("titulo")}
        </h1>

        <p className="mt-6 max-w-(--width-prose) text-muted">{t("texto")}</p>

        <p className="mt-4 font-mono text-label uppercase tracking-[0.06em] text-accent">
          {t("status")}
        </p>

        <Reveal className="mt-(--space-block)">
          <ContactForm />
        </Reveal>

        <Reveal className="mt-(--space-block)">
          <h2 className="font-mono text-label uppercase tracking-[0.06em] text-muted">
            {t("outrosCanais")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-5">
            {LINKS.map(({ key, href }) => (
              <li key={key}>
                <a
                  href={href}
                  className="text-accent underline-offset-4 hover:underline"
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {social(key)}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
