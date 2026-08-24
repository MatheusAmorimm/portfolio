import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
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

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }


  return (
    <html
      lang={locale}
      className={`${displayFace.variable} ${monoFace.variable} h-full antialiased`}
    >
      <head>
        {/*
          Sem JavaScript, o `initial` que o motion renderiza no servidor
          (opacity: 0) nunca seria animado até 1 e a seção ficaria
          invisível. `!important` numa folha vence estilo inline — este é
          o critério de aceite "funciona com JS de animação desativado".
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
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
