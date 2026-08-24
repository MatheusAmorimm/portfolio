import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/sections/ProjectCard";
import type { Project } from "@/lib/projects/loader";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");

  if (projects.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {projects.map((project, index) => (
        <li key={project.frontmatter.slug}>
          {/* 70 ms entre cards — faixa de stagger do CLAUDE.md. */}
          <Reveal delay={index * 0.07} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
