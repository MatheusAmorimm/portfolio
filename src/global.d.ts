import type pt from "./content/i18n/pt.json";
import type { routing } from "./i18n/routing";

// O dicionário PT é a fonte da verdade das chaves: é o idioma padrão e o
// único que nunca fica incompleto. Ligar o t() a ele faz o TypeScript
// recusar chave que não existe.
//
// Usa a augmentação `AppConfig` da v4 do next-intl, e NÃO o padrão antigo
// `declare global { interface IntlMessages extends Messages {} }`: a regra
// @typescript-eslint/no-empty-object-type está como erro neste projeto e
// reprovaria a interface vazia.
// `Locale` faz useLocale() e getLocale() devolverem "pt" | "en" em vez de
// string, o que permite indexar mapas por idioma sem revalidar o valor
// que o roteamento já garantiu.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof pt;
  }
}

export {};
