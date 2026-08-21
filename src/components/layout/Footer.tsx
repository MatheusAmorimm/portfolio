import { useTranslations } from "next-intl";
import { DISPLAY_NAME, SOCIAL } from "@/lib/social";

const LINKS = [
  { key: "github", href: SOCIAL.github },
  { key: "linkedin", href: SOCIAL.linkedin },
  { key: "email", href: `mailto:${SOCIAL.email}` },
] as const;

export function Footer() {
  const t = useTranslations("social");

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-(--width-container) flex-wrap items-center justify-between gap-4 px-(--space-gutter) py-8">
        <p className="font-mono text-label uppercase tracking-[0.06em] text-muted">
          {DISPLAY_NAME}
        </p>
        <ul className="flex items-center gap-5">
          {LINKS.map(({ key, href }) => (
            <li key={key}>
              <a
                href={href}
                className="text-muted transition-colors duration-(--duration-hover) hover:text-foreground"
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
