import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/components";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
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

  const { title, summary, year, stack, links } = project.frontmatter;
  const source = locale === "en" ? project.body.en : project.body.pt;
  const Body = source ? await compileBody(source) : null;

  return (
    <article className="py-(--space-section)">
      <Container>
        <header className="max-w-(--width-prose)">
          <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
            {year}
          </p>

          <h1 className="mt-4 font-display text-h1 font-semibold tracking-tight text-balance">
            {title[locale]}
          </h1>

          <p className="mt-6 text-foreground">{summary[locale]}</p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label={t("stack")}>
            {stack.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>

          {(links.repo ?? links.demo) ? (
            <ul className="mt-6 flex flex-wrap gap-5">
              {links.repo ? (
                <li>
                  <a
                    href={links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {t("repo")}
                  </a>
                </li>
              ) : null}
              {links.demo ? (
                <li>
                  <a
                    href={links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {t("demo")}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </header>

        <Reveal className="mt-(--space-block) max-w-(--width-prose)">
          {Body ? (
            <Body components={mdxComponents} />
          ) : (
            <p className="text-muted">{t("translationPending")}</p>
          )}
        </Reveal>
      </Container>
    </article>
  );
}
