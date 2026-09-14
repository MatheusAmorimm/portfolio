import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

/**
 * Fora do roteamento por idioma: /api, internos do Next e da Vercel,
 * qualquer caminho com ponto (arquivos estáticos e as capas .png) e os
 * ícones gerados — /icon, /icon1 e /apple-icon não têm extensão, e sem
 * esta exceção caíam em /pt/icon, que é 404.
 */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|icon|apple-icon|.*\\..*).*)",
};
