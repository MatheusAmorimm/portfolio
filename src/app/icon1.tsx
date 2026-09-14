import { ImageResponse } from "next/og";
import { IconArt } from "@/components/seo/IconArt";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

/**
 * Favicon em PNG, para quem não desenha SVG na aba (Safari) e para o
 * Google, que pede múltiplo de 48 px. O sufixo numérico é a convenção
 * do Next para mais de um `icon`.
 */
export default function Icon() {
  return new ImageResponse(<IconArt size={size.width} rounded />, size);
}
