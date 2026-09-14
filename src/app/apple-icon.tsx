import { ImageResponse } from "next/og";
import { IconArt } from "@/components/seo/IconArt";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone da tela inicial do iOS. Sem cantos: o sistema arredonda. */
export default function AppleIcon() {
  return new ImageResponse(
    <IconArt size={size.width} rounded={false} />,
    size,
  );
}
