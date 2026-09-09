import { useTranslations } from "next-intl";
import { Intro } from "@/components/motion/Intro";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { IntroScene } from "@/components/sections/IntroScene";
import { StackStrip } from "@/components/sections/StackStrip";
import { listProjects } from "@/lib/projects/loader";

export default function HomePage() {
  const t = useTranslations("intro");
  const featured = listProjects().filter(
    (project) => project.frontmatter.featured,
  );

  return (
    <>
      {/*
        Só a home tem a cortina, e só na primeira visita da sessão. Quem
        chega num case por link vê o case. A cena vai pronta do servidor.
      */}
      <Intro skipLabel={t("skip")}>
        <IntroScene />
      </Intro>
      <Hero />
      <FeaturedProjects projects={featured} />
      <AboutTeaser />
      <StackStrip />
    </>
  );
}
