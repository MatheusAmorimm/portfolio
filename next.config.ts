import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /*
     * Injeta o CSS como <style> no <head> em vez de <link>, eliminando
     * uma ida à rede do caminho crítico de renderização.
     *
     * A documentação do Next recomenda ligar exatamente neste cenário:
     * CSS atômico (Tailwind) e visitante de primeira viagem. Num
     * portfólio quase todo acesso é o primeiro — um recrutador abre o
     * link uma vez —, então o cache de folha de estilo que se perde
     * quase nunca seria aproveitado.
     *
     * A flag é experimental. Se quebrar numa versão futura, tirar esta
     * chave devolve o comportamento padrão sem tocar em mais nada.
     */
    inlineCss: true,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
