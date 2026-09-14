import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary";

/**
 * Rotas internas que o next-intl conhece (config `pathnames` em
 * `src/i18n/routing.ts`) — o mesmo conjunto que `<Link>` aceita.
 */
type AppPathname = Extract<ComponentProps<typeof Link>["href"], string>;

type Props =
  | {
      href: AppPathname;
      children: ReactNode;
      variant?: Variant;
      external?: false;
    }
  | {
      href: string;
      children: ReactNode;
      variant?: Variant;
      /** Link para fora do site ou download. Usa <a>, não o Link do next-intl. */
      external: true;
      /**
       * Abre em nova aba, com `rel="noopener noreferrer"`. Todo link para
       * fora e todo download usam isto, por decisão do autor: o visitante
       * vai olhar o código ou o PDF e volta, e o portfólio continua aberto.
       * Rotas internas nunca — a navegação no site é na mesma aba.
       */
      newTab?: boolean;
      /** Só o link externo tem handler: o interno é navegação, e pronto. */
      onClick?: MouseEventHandler<HTMLAnchorElement>;
    };

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-badge px-5 py-3 font-medium transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:outline-offset-2";

const VARIANTS: Record<Variant, string> = {
  // Um único preenchimento âmbar por tela — regra da spec § 4.1.
  primary: "bg-accent-strong text-on-accent hover:bg-accent",
  secondary:
    "border border-border text-foreground hover:border-border-strong hover:bg-surface",
};

export function Button(props: Props) {
  const { children, variant = "primary" } = props;
  const className = `${BASE} ${VARIANTS[variant]}`;

  if (props.external) {
    return (
      <a
        href={props.href}
        className={className}
        onClick={props.onClick}
        {...(props.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={props.href} className={className}>
      {children}
    </Link>
  );
}
