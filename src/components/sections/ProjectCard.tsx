import { useLocale } from "next-intl";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/projects/loader";
import { stackLabel } from "@/lib/projects/schema";

/**
 * Card do grid de projetos. O link cobre o card inteiro por `::after`
 * esticado: a área de clique fica grande sem aninhar o título dentro de
 * um link que engoliria a capa e as etiquetas na leitura por teclado.
 *
 * Elevação sem sombra — em fundo escuro ela não aparece. Troca de
 * superfície e de contorno, como define a spec § 4.1.
 */
type Props = {
  project: Project;
  /**
   * Card acima da dobra. Carrega a capa com prioridade (preload +
   * fetchPriority alto) em vez de lazy: é ela que costuma ser o
   * elemento de LCP desta página.
   */
  priority?: boolean;
  /**
   * Nível do título do card, para a hierarquia da página fechar sem
   * salto. Em /projetos o card vem logo abaixo do h1 e é h2; na home
   * ele vem dentro da seção "Em destaque", que já é h2, e vira h3.
   */
  headingLevel?: 2 | 3;
};

export function ProjectCard({
  project,
  priority = false,
  headingLevel = 3,
}: Props) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const locale = useLocale();
  const { slug, title, summary, year, stack, cover } = project.frontmatter;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card border border-border bg-surface transition-colors duration-(--duration-hover) hover:border-border-strong hover:bg-surface-hover">
      <Image
        src={cover}
        alt=""
        width={1200}
        height={630}
        // Descreve o layout real, não uma aproximação: o grid vira duas
        // colunas em 640px (breakpoint `sm`), e acima de 1120px o
        // Container trava a largura, então o card para de crescer em
        // 516px = (1120 - 64 de gutter - 24 de gap) / 2. Sem o teto, um
        // monitor de 1920px baixaria o candidato de 1080px para exibir
        // 516 — e esta é a imagem de LCP da página.
        sizes="(min-width: 1120px) 516px, (min-width: 640px) 50vw, 100vw"
        priority={priority}
        className="aspect-1200/630 w-full object-cover"
      />

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-accent">
          {year}
        </p>

        <Heading className="mt-2 font-display text-h3 font-semibold text-foreground">
          <Link
            href={{ pathname: "/projetos/[slug]", params: { slug } }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title[locale]}
          </Link>
        </Heading>

        <p className="mt-3 text-muted">{summary[locale]}</p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {stack.slice(0, 4).map((item) => {
            const label = stackLabel(item, locale);
            return (
              <li key={label}>
                <Badge>{label}</Badge>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
