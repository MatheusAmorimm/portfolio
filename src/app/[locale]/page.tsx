import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { StackStrip } from "@/components/sections/StackStrip";
import { listProjects } from "@/lib/projects/loader";

export default function HomePage() {
  const featured = listProjects().filter(
    (project) => project.frontmatter.featured,
  );

  return (
    <>
      <Hero />
      <FeaturedProjects projects={featured} />
      <AboutTeaser />
      <StackStrip />
    </>
  );
}
