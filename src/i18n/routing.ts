import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/projetos": { pt: "/projetos", en: "/projects" },
    "/projetos/[slug]": { pt: "/projetos/[slug]", en: "/projects/[slug]" },
    "/sobre": { pt: "/sobre", en: "/about" },
    "/contato": { pt: "/contato", en: "/contact" },
  },
});
