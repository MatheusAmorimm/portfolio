import { useLocale, useTranslations } from "next-intl";
import { formatMonth, TIMELINE } from "@/lib/timeline";

export function Timeline() {
  const t = useTranslations("timeline");
  const locale = useLocale();

  return (
    <section aria-labelledby="timeline-title" className="mt-(--space-block)">
      <h2
        id="timeline-title"
        className="font-mono text-label uppercase tracking-[0.06em] text-muted"
      >
        {t("title")}
      </h2>

      <ol className="mt-6 border-l border-border">
        {TIMELINE.map((entry) => (
          <li key={entry.id} className="relative py-4 pl-6">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-6 h-2 w-2 -translate-x-1/2 rounded-full ${
                entry.kind === "education" ? "bg-accent" : "bg-border-strong"
              }`}
            />
            <p className="font-mono text-label uppercase tracking-[0.06em] text-muted">
              <time dateTime={entry.start}>
                {formatMonth(entry.start, locale)}
              </time>
              {" – "}
              {entry.end ? (
                <time dateTime={entry.end}>
                  {formatMonth(entry.end, locale)}
                </time>
              ) : (
                t("ongoing")
              )}
            </p>
            <p className="mt-1">{t(entry.id)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
