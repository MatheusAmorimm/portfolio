import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing } from "@/i18n/routing";
import { CAMINHOS, permiteIndexacao, siteUrl } from "@/lib/site";
import { DISPLAY_NAME } from "@/lib/social";
import "../globals.css";

const displayFace = Geist({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

const monoFace = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "seo" });
  const base = siteUrl();

  return {
    metadataBase: base,
    title: {
      // As páginas internas viram "Projetos — Matheus Amorim …"; a home
      // usa o título inteiro, sem repetir o nome duas vezes.
      default: t("title"),
      template: `%s — ${DISPLAY_NAME}`,
    },
    description: t("description"),
    alternates: {
      canonical: CAMINHOS["/"][locale],
      languages: {
        "pt-BR": CAMINHOS["/"].pt,
        "en-US": CAMINHOS["/"].en,
        // O x-default aponta para PT, idioma padrão do site.
        "x-default": CAMINHOS["/"].pt,
      },
    },
    openGraph: {
      type: "website",
      siteName: DISPLAY_NAME,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      title: t("title"),
      description: t("description"),
      url: CAMINHOS["/"][locale],
    },
    // Produção indexa; preview de deploy, não — ver lib/site.ts.
    robots: permiteIndexacao()
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "seo" });
  const mensagens = await getMessages();

  return (
    <html
      lang={locale}
      className={`${displayFace.variable} ${monoFace.variable} h-full antialiased`}
    >
      <head>
        {/*
          Sem JavaScript, `[data-reveal]` nasce com opacity: 0 pelo
          globals.css e o observador que o revela nunca roda — a seção
          ficaria invisível. Este é o critério de aceite "funciona com
          JavaScript desativado".
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <JsonLd jobTitle={t("jobTitle")} />
      </head>
      <body className="flex min-h-full flex-col">
        {/*
          Só os namespaces que componentes de cliente realmente usam:
          `locale` (seletor de idioma) e `contact` (formulário). Sem esta
          poda, o dicionário INTEIRO — biografia, trajetória, textos dos
          seis cases — era serializado no HTML de toda página só para
          alimentar dois componentes. O resto é lido no servidor, onde
          nunca precisou atravessar a rede.
        */}
        <NextIntlClientProvider
          messages={{ locale: mensagens.locale, contact: mensagens.contact }}
        >
          <Header />
          {/*
            <main> de verdade, e não uma div: sem o landmark o leitor de
            tela não tem "ir para o conteúdo principal", e sem o
            tabIndex={-1} o alvo não é focável — o link de pular
            conteúdo movia a rolagem mas deixava o foco no header, que é
            o mesmo que não ter link nenhum para quem usa teclado.
          */}
          <main id="conteudo" tabIndex={-1} className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
