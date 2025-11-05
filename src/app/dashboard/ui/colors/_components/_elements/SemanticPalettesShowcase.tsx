"use client";

import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Palette,
} from "lucide-react";
import ColorPalette from "./ColorPalette";

/**
 * Semantic Palettes Showcase
 *
 * Displays full color scales for semantic colors
 */
export default function SemanticPalettesShowcase() {
  return (
    <>
      <ColorPalette
        name="Success Palette"
        description="Complete success color scale (50-950)"
        icon={CheckCircle}
        colors={[
          "bg-brandSuccess-50",
          "bg-brandSuccess-100",
          "bg-brandSuccess-200",
          "bg-brandSuccess-300",
          "bg-brandSuccess-400",
          "bg-brandSuccess-500",
          "bg-brandSuccess-600",
          "bg-brandSuccess-700",
          "bg-brandSuccess-800",
          "bg-brandSuccess-900",
          "bg-brandSuccess-950",
        ]}
      />

      <ColorPalette
        name="Error Palette"
        description="Complete error color scale (50-950)"
        icon={AlertCircle}
        colors={[
          "bg-brandError-50",
          "bg-brandError-100",
          "bg-brandError-200",
          "bg-brandError-300",
          "bg-brandError-400",
          "bg-brandError-500",
          "bg-brandError-600",
          "bg-brandError-700",
          "bg-brandError-800",
          "bg-brandError-900",
          "bg-brandError-950",
        ]}
      />

      <ColorPalette
        name="Warning Palette"
        description="Complete warning color scale (50-950)"
        icon={AlertTriangle}
        colors={[
          "bg-brandWarning-50",
          "bg-brandWarning-100",
          "bg-brandWarning-200",
          "bg-brandWarning-300",
          "bg-brandWarning-400",
          "bg-brandWarning-500",
          "bg-brandWarning-600",
          "bg-brandWarning-700",
          "bg-brandWarning-800",
          "bg-brandWarning-900",
          "bg-brandWarning-950",
        ]}
      />

      <ColorPalette
        name="Info Palette"
        description="Complete info color scale (50-950)"
        icon={Info}
        colors={[
          "bg-brandInfo-50",
          "bg-brandInfo-100",
          "bg-brandInfo-200",
          "bg-brandInfo-300",
          "bg-brandInfo-400",
          "bg-brandInfo-500",
          "bg-brandInfo-600",
          "bg-brandInfo-700",
          "bg-brandInfo-800",
          "bg-brandInfo-900",
          "bg-brandInfo-950",
        ]}
      />

      <ColorPalette
        name="Neutral Palette (Slate)"
        description="Primary neutral color scale for text, backgrounds, and borders"
        icon={Palette}
        colors={[
          "bg-slate-50",
          "bg-slate-100",
          "bg-slate-200",
          "bg-slate-300",
          "bg-slate-400",
          "bg-slate-500",
          "bg-slate-600",
          "bg-slate-700",
          "bg-slate-800",
          "bg-slate-900",
          "bg-slate-950",
        ]}
      />
    </>
  );
}
