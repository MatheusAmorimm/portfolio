import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { STACK_GROUPS } from "@/lib/stack";

export function StackStrip() {
  const t = useTranslations("stack");

  return (
    <section
      className="border-t border-border py-(--space-block)"
      aria-labelledby="stack-title"
    >
      <Container>
        <h2
          id="stack-title"
          className="font-mono text-label uppercase tracking-[0.06em] text-muted"
        >
          {t("title")}
        </h2>

        <dl className="mt-8 grid gap-8 sm:grid-cols-2">
          {STACK_GROUPS.map((group) => (
            <div key={group.id}>
              <dt className="font-mono text-label uppercase tracking-[0.06em] text-muted">
                {t(group.id)}
              </dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-badge bg-surface px-2.5 py-1 font-mono text-label text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
