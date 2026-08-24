import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import type { Project } from "@/lib/projects/loader";

/**
 * Cards da primeira linha do grid (duas colunas no desktop). Eles nascem
 * acima da dobra, então NÃO passam pelo <Reveal>: o reveal parte de
 * `opacity: 0` e só anima depois da hidratação e do carregamento do
 * chunk de animação — o que faria o LCP esperar por JavaScript. Entram
 * por CSS, e a capa deles carrega com prioridade.
 */
const ABOVE_FOLD = 2;

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  if (projects.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {projects.map((project, index) => {
        const aboveFold = index < ABOVE_FOLD;
        const card = (
          <ProjectCard project={project} priority={aboveFold} />
        );

        return (
          <li key={project.frontmatter.slug} className="h-full">
            {aboveFold ? (
              <div
                className="card-rise h-full"
                // 70 ms entre cards — faixa de stagger do CLAUDE.md.
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {card}
              </div>
            ) : (
              // Escalona por coluna, não pelo índice absoluto: o card 6
              // não deve esperar meio segundo quando entra na viewport.
              <Reveal delay={(index % 2) * 0.07} className="h-full">
                {card}
              </Reveal>
            )}
          </li>
        );
      })}
    </ul>
  );
}
