import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getProject, listProjects } from "@/lib/projects/loader";
import { compileBody } from "@/lib/projects/render";

// Slug fora da lista dá 404 em vez de tentar renderizar sob demanda.
// Em produção, listProjects exclui drafts — logo draft dá 404, como o
// CLAUDE.md exige.
export const dynamicParams = false;

export function generateStaticParams() {
  return listProjects().map((project) => ({
    slug: project.frontmatter.slug,
  }));
}

export default async function CasePage({
  params,
}: PageProps<"/[locale]/projetos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  const locale = await getLocale();
  const t = await getTranslations("project");

  const source = locale === "en" ? project.body.en : project.body.pt;
  const Body = source ? await compileBody(source) : null;

  return (
    <article className="py-(--space-section)">
      <Container>
        <h1 className="font-display text-h1 font-semibold tracking-tight">
          {project.frontmatter.title[locale]}
        </h1>
        <p className="mt-4 max-w-(--width-prose) text-muted">
          {project.frontmatter.summary[locale]}
        </p>

        {Body ? (
          <div className="mt-8 max-w-(--width-prose)">
            <Body />
          </div>
        ) : (
          <p className="mt-8 max-w-(--width-prose) text-muted">
            {t("translationPending")}
          </p>
        )}
      </Container>
    </article>
  );
}
