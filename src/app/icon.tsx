import { iconSvg } from "@/lib/icon";

export const contentType = "image/svg+xml";

/**
 * Favicon vetorial. É rota, e não um `icon.svg` estático, para que as
 * cores venham do globals.css como no resto do site — um SVG solto teria
 * de repetir os três hex à mão. Gerado na build.
 */
export default function Icon() {
  return new Response(iconSvg(), {
    headers: { "Content-Type": contentType },
  });
}
