"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  GradientType
} from "qr-code-styling";

interface Props {
  value: string;
  size?: number;
  level?: ErrorCorrectionLevel;
  fgColor?: string;
  gradientColor?: string;
  gradientType?: "linear" | "radial";
  gradientAngle?: number;
  bgColor?: string;
  dotStyle?: DotType;
  eyeStyle?: CornerSquareType;
  eyeDotStyle?: CornerDotType;
  /** Data URL for logo — rendered as crisp React img overlay */
  logo?: string;
  /** 0.08 – 0.4 fraction of QR size */
  logoSize?: number;
  /** Hex color to tint the logo icon strokes (SVG recoloring) */
  logoColor?: string;
  /** Background fill of the logo badge */
  logoBgColor?: string;
  pattern?: "none" | "dots" | "grid" | "waves";
  holographic?: boolean;
}

/** Recolor an SVG data-URL by replacing stroke/fill="#000000" with a new hex */
function recolorSvgDataUrl(dataUrl: string, newColor: string): string {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml;base64,")) return dataUrl;
  try {
    const b64 = dataUrl.replace("data:image/svg+xml;base64,", "");
    let svg = atob(b64);
    // Replace stroke and fill black with the new color
    svg = svg
      .replace(/stroke="#000000"/g, `stroke="${newColor}"`)
      .replace(/stroke="black"/g, `stroke="${newColor}"`)
      .replace(/fill="#000000"/g, `fill="${newColor}"`)
      .replace(/fill="black"/g, `fill="${newColor}"`);
    return "data:image/svg+xml;base64," + btoa(svg);
  } catch {
    return dataUrl;
  }
}

export const PremiumQrRenderer = ({
  value,
  size = 300,
  level = "H",
  fgColor = "#000000",
  gradientColor,
  gradientType = "linear",
  gradientAngle = 45,
  bgColor = "#ffffff",
  dotStyle = "square",
  eyeStyle = "square",
  eyeDotStyle = "square",
  logo,
  logoSize = 0.22,
  logoColor = "#000000",
  logoBgColor = "#ffffff",
  pattern = "none",
  holographic = false,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // When pattern active → QR background transparent so pattern shows through
  const effectiveBgColor = pattern !== "none" ? "transparent" : bgColor;

  // Recolor logo SVG to match logoColor
  const coloredLogo = useMemo(
    () => (logo && logoColor !== "#000000" ? recolorSvgDataUrl(logo, logoColor) : logo),
    [logo, logoColor]
  );

  const buildOptions = () => ({
    width: size,
    height: size,
    type: "svg" as DrawType,
    data: value || " ",
    dotsOptions: {
      color: fgColor,
      type: dotStyle,
      gradient: gradientColor
        ? {
            type: (gradientType === "linear" ? "linear" : "radial") as GradientType,
            rotation: gradientAngle * (Math.PI / 180),
            colorStops: [
              { offset: 0, color: fgColor },
              { offset: 1, color: gradientColor },
            ],
          }
        : undefined,
    },
    backgroundOptions: { color: effectiveBgColor },
    cornersSquareOptions: { color: fgColor, type: eyeStyle },
    cornersDotOptions: { color: fgColor, type: eyeDotStyle },
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: level,
    },
  });

  useEffect(() => {
    if (!containerRef.current) return;
    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(buildOptions());
      qrCodeRef.current.append(containerRef.current);
    } else {
      qrCodeRef.current.update(buildOptions());
    }
  }, [value, size, level, fgColor, gradientColor, gradientType, gradientAngle, effectiveBgColor, dotStyle, eyeStyle, eyeDotStyle]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!holographic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Pattern CSS styles (rendered behind QR)
  const patternStyle: React.CSSProperties =
    pattern === "dots"
      ? { backgroundImage: "radial-gradient(#c9cdd4 1.2px, transparent 1.2px)", backgroundSize: "16px 16px" }
      : pattern === "grid"
      ? {
          backgroundImage:
            "linear-gradient(to right, rgba(128,128,128,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }
      : pattern === "waves"
      ? {
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(150,150,150,0.2) 41%, rgba(150,150,150,0.2) 55%, transparent 56%)",
          backgroundSize: "36px 36px",
        }
      : {};

  // Logo badge dimensions
  const badgeSize = Math.round(size * logoSize * 1.7);
  const imgSize = Math.round(size * logoSize);
  const badgeOffset = Math.round((size - badgeSize) / 2);
  const badgePad = Math.round(badgeSize * 0.12);
  const badgeRadius = Math.round(badgeSize * 0.22);

  return (
    <div
      className="relative overflow-hidden transition-all duration-300"
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
    >
      {/* Pattern fill layer (below QR, which is transparent when pattern is active) */}
      {pattern !== "none" && (
        <div
          className="absolute inset-0 z-0"
          style={{ backgroundColor: bgColor, ...patternStyle }}
        />
      )}

      {/* QR code — library renders SVG with transparent background when pattern active */}
      <div ref={containerRef} className="absolute inset-0 z-10" />

      {/* Logo badge overlay — React-rendered for crisp, colorable display */}
      {coloredLogo && (
        <div
          className="absolute z-20 flex items-center justify-center shadow-lg"
          style={{
            width: badgeSize,
            height: badgeSize,
            top: badgeOffset,
            left: badgeOffset,
            backgroundColor: logoBgColor,
            padding: badgePad,
            borderRadius: badgeRadius,
          }}
        >
          <img
            src={coloredLogo}
            alt="logo"
            width={imgSize}
            height={imgSize}
            style={{ objectFit: "contain", display: "block", width: imgSize, height: imgSize }}
          />
        </div>
      )}

      {/* Holographic shimmer */}
      {holographic && (
        <>
          <div
            className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.9) 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-tr from-indigo-500/10 via-transparent to-pink-500/10 mix-blend-color" />
        </>
      )}
    </div>
  );
};
