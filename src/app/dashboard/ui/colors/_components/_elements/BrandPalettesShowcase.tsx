"use client";

import { Palette, Sparkles, Zap } from "lucide-react";
import ColorPalette from "./ColorPalette";

/**
 * Brand Palettes Showcase
 *
 * Displays full color scales for brand colors (Primary, Secondary, Accent)
 */
export default function BrandPalettesShowcase() {
  return (
    <>
      <ColorPalette
        name="Primary Palette"
        description="Complete primary brand color scale (50-950)"
        icon={Palette}
        colors={[
          "bg-brandPrimary-50",
          "bg-brandPrimary-100",
          "bg-brandPrimary-200",
          "bg-brandPrimary-300",
          "bg-brandPrimary-400",
          "bg-brandPrimary-500",
          "bg-brandPrimary-600",
          "bg-brandPrimary-700",
          "bg-brandPrimary-800",
          "bg-brandPrimary-900",
          "bg-brandPrimary-950",
        ]}
      />

      <ColorPalette
        name="Secondary Palette"
        description="Complete secondary brand color scale (50-950)"
        icon={Sparkles}
        colors={[
          "bg-brandSecondary-50",
          "bg-brandSecondary-100",
          "bg-brandSecondary-200",
          "bg-brandSecondary-300",
          "bg-brandSecondary-400",
          "bg-brandSecondary-500",
          "bg-brandSecondary-600",
          "bg-brandSecondary-700",
          "bg-brandSecondary-800",
          "bg-brandSecondary-900",
          "bg-brandSecondary-950",
        ]}
      />

      <ColorPalette
        name="Accent Palette"
        description="Complete accent color scale (50-950)"
        icon={Zap}
        colors={[
          "bg-brandAccent-50",
          "bg-brandAccent-100",
          "bg-brandAccent-200",
          "bg-brandAccent-300",
          "bg-brandAccent-400",
          "bg-brandAccent-500",
          "bg-brandAccent-600",
          "bg-brandAccent-700",
          "bg-brandAccent-800",
          "bg-brandAccent-900",
          "bg-brandAccent-950",
        ]}
      />
    </>
  );
}
