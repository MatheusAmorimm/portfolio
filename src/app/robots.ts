import type { MetadataRoute } from "next";
import { permiteIndexacao, siteUrl } from "@/lib/site";

/**
 * Enquanto o autor não liberar, o site inteiro fica fora dos buscadores.
 *
 * Isto não é excesso de zelo: o Google indexa a primeira versão que
 * encontra e demora a trocar. Um portfólio pela metade aparecendo na
 * busca pelo nome do autor — que é exatamente o que um recrutador
 * digita — é pior do que não aparecer.
 *
 * Para liberar: NEXT_PUBLIC_ALLOW_INDEXING=true nas variáveis da Vercel.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();

  if (!permiteIndexacao()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: new URL("/sitemap.xml", base).toString(),
    host: base.origin,
  };
}
