import { ICON, iconColors } from "@/lib/icon";

/**
 * A mesma cena do favicon, desenhada com divs para o Satori (`next/og`),
 * que rasteriza o PNG de 48 px e o ícone de 180 px do iOS. O Satori não
 * resolve `var()` nem lê o SVG pronto, então cada ponto é um div redondo
 * e a reta é um div girado — geometria e cores vêm de `lib/icon.ts`.
 */
export function IconArt({ size, rounded }: { size: number; rounded: boolean }) {
  const c = iconColors();
  const px = (fraction: number) => fraction * size;

  const { x1, y1, x2, y2 } = ICON.line;
  const dx = px(x2 - x1);
  const dy = px(y2 - y1);
  const length = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const width = px(ICON.lineWidth);
  const radius = px(ICON.dotRadius);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        position: "relative",
        backgroundColor: c.background,
        borderRadius: rounded ? px(ICON.corner) : 0,
      }}
    >
      {ICON.dots.map((dot) => (
        <div
          key={`${dot.x}-${dot.y}`}
          style={{
            position: "absolute",
            left: px(dot.x) - radius,
            top: px(dot.y) - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: "50%",
            backgroundColor: c.dots,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          // Centro do div no ponto médio da reta; a rotação faz o resto.
          left: px(x1) + dx / 2 - length / 2,
          top: px(y1) + dy / 2 - width / 2,
          width: length,
          height: width,
          borderRadius: width / 2,
          backgroundColor: c.line,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
