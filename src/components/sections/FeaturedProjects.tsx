import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/projects/loader";

/**
 * Destaques na home. Recebe os projetos já filtrados pela página — o
 * componente não lê o disco, para continuar sendo só apresentação.
 *
 * `aboveFold={0}`: esta seção vem depois do hero, que é quem carrega o
 * LCP. Nenhuma capa daqui deve disputar banda com ele.
 */
export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className="border-t border-border py-(--space-block)"
      aria-labelledby="featured-title"
    >
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="featured-title"
              className="font-mono text-label uppercase tracking-[0.06em] text-muted"
            >
              {t("featured")}
            </h2>
            <Link
              href="/projetos"
              className="text-accent underline-offset-4 hover:underline"
            >
              {t("seeAll")}
            </Link>
          </div>
        </Reveal>

        <div className="mt-8">
          <ProjectGrid projects={projects} aboveFold={0} />
        </div>
      </Container>
    </section>
  );
}
