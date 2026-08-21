import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("nav");

  return (
    <main className="mx-auto w-full max-w-(--width-container) px-(--space-gutter) py-(--space-section)">
      <h1 className="font-display text-display font-semibold tracking-tight">
        Matheus Amorim
      </h1>
      <p className="mt-4 font-mono text-label uppercase tracking-[0.06em] text-muted">
        {t("home")}
      </p>
    </main>
  );
}
