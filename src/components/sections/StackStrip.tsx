import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
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
        <Reveal>
          <h2
            id="stack-title"
            className="font-mono text-label uppercase tracking-[0.06em] text-muted"
          >
            {t("title")}
          </h2>
        </Reveal>

        <dl className="mt-8 grid gap-8 sm:grid-cols-2">
          {STACK_GROUPS.map((group, index) => (
            // 70 ms entre grupos: dentro da faixa de 60–80 ms do CLAUDE.md.
            <Reveal key={group.id} delay={index * 0.07}>
              <dt className="font-mono text-label uppercase tracking-[0.06em] text-muted">
                {t(group.id)}
              </dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge>{item}</Badge>
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
