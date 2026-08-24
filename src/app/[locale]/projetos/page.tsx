import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { CAMINHOS } from "@/lib/site";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Container } from "@/components/ui/Container";
import { Tabs } from "@/components/ui/Tabs";
import { listProjects } from "@/lib/projects/loader";
import { projectsForTab, resolveTab, TABS } from "@/lib/tabs";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projetos">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const caminhos = CAMINHOS["/projetos"];

  return {
    title: t("title"),
    alternates: {
      canonical: caminhos[locale],
      languages: { "pt-BR": caminhos.pt, "en-US": caminhos.en },
    },
  };
}

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/[locale]/projetos">) {
  const { tab } = await searchParams;
  const active = resolveTab(typeof tab === "string" ? tab : undefined);
  const t = await getTranslations("projects");

  const projects = listProjects();

  // Os painéis são montados no servidor e entregues prontos ao componente
  // de abas: a troca de aba não busca nada, só troca o que já está aqui.
  const tabs = TABS.map((entry) => ({
    id: entry.id,
    label: t(`tabs.${entry.id}`),
    panel: <ProjectGrid projects={projectsForTab(projects, entry.id)} />,
  }));

  return (
    <section className="py-(--space-section)">
      <Container>
        {/*
          Sem parágrafo de introdução: não existe texto para esta página
          no conteudo-site.md, e inventar um é proibido. Título e abas
          bastam — a página é um índice, não um argumento.
        */}
        <h1 className="font-display text-h1 font-semibold tracking-tight">
          {t("title")}
        </h1>

        <div className="mt-(--space-block)">
          <Tabs tabs={tabs} initial={active} />
        </div>
      </Container>
    </section>
  );
}
