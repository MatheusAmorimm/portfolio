import type { MDXComponents } from "mdx/types";

/**
 * Estilo do corpo dos cases. O MDX gera HTML nativo (h2, p, strong...)
 * e este mapa aplica os tokens a cada elemento — é o equivalente ao
 * plugin de typography do Tailwind, sem a dependência e sem escapar do
 * design system.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-(--space-block) font-display text-h2 font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 font-display text-h3 font-semibold text-foreground"
      {...props}
    />
  ),
  p: (props) => <p className="mt-5 text-muted" {...props} />,
  ul: (props) => (
    <ul className="mt-5 list-disc space-y-2 pl-5 text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-5 list-decimal space-y-2 pl-5 text-muted" {...props} />
  ),
  strong: (props) => (
    <strong className="font-medium text-foreground" {...props} />
  ),
  // Abre cada decisão técnica; destacada do corpo por cor, não por peso.
  em: (props) => <em className="text-foreground" {...props} />,
  code: (props) => (
    <code
      className="rounded-badge bg-surface px-1.5 py-0.5 font-mono text-foreground"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-accent underline-offset-4 hover:underline"
      {...props}
      {...(props.href?.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    />
  ),
  hr: (props) => <hr className="mt-(--space-block) border-border" {...props} />,
};
