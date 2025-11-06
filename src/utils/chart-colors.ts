/**
 * Chart Color Palette Utilities
 *
 * Provides color palette options for charts:
 * 1. Brand theme colors - Different colors based on brand theme
 * 2. Primary shades - Different shades of the primary brand color
 */

import type { ChartConfig } from "@/components/ui/chart";

/**
 * Brand theme color palette option
 * Uses different colors from the brand theme (primary, secondary, accent, etc.)
 */
export const brandThemeColors: ChartConfig = {
  color1: {
    label: "Primary",
    color: "hsl(var(--primary))",
  },
  color2: {
    label: "Secondary",
    color: "hsl(var(--secondary))",
  },
  color3: {
    label: "Accent",
    color: "hsl(var(--accent))",
  },
  color4: {
    label: "Info",
    color: "hsl(221, 83%, 53%)", // Info blue
  },
  color5: {
    label: "Success",
    color: "hsl(142, 76%, 36%)", // Success green
  },
  color6: {
    label: "Warning",
    color: "hsl(43, 96%, 56%)", // Warning orange
  },
  color7: {
    label: "Destructive",
    color: "hsl(var(--destructive))",
  },
  color8: {
    label: "Muted",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

/**
 * Get brand theme colors as an array for easy iteration
 */
export function getBrandThemeColorArray(): string[] {
  return [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(221, 83%, 53%)", // Info blue
    "hsl(142, 76%, 36%)", // Success green
    "hsl(43, 96%, 56%)", // Warning orange
    "hsl(var(--destructive))",
    "hsl(var(--muted-foreground))",
  ];
}

/**
 * Primary color shades palette option
 * Uses different shades of the primary brand color
 * Primary color HSL: 222.2 47.4% 11.2% (from globals.css)
 */
export const primaryShadesColors: ChartConfig = {
  color1: {
    label: "Primary Light",
    color: "hsl(222.2, 47.4%, 85%)", // Very light shade
  },
  color2: {
    label: "Primary",
    color: "hsl(222.2, 47.4%, 70%)", // Light shade
  },
  color3: {
    label: "Primary Base",
    color: "hsl(var(--primary))", // Base primary: 222.2 47.4% 11.2%
  },
  color4: {
    label: "Primary Dark",
    color: "hsl(222.2, 47.4%, 20%)", // Darker shade
  },
  color5: {
    label: "Primary Darker",
    color: "hsl(222.2, 47.4%, 15%)", // Even darker
  },
  color6: {
    label: "Primary Darkest",
    color: "hsl(222.2, 47.4%, 8%)", // Darkest shade
  },
  color7: {
    label: "Primary Accent",
    color: "hsl(222.2, 47.4%, 50%)", // Medium shade
  },
  color8: {
    label: "Primary Muted",
    color: "hsl(222.2, 25%, 40%)", // Muted variant
  },
} satisfies ChartConfig;

/**
 * Get primary shades colors as an array for easy iteration
 */
export function getPrimaryShadesColorArray(): string[] {
  return [
    "hsl(222.2, 47.4%, 85%)", // Very light
    "hsl(222.2, 47.4%, 70%)", // Light
    "hsl(var(--primary))", // Base
    "hsl(222.2, 47.4%, 20%)", // Dark
    "hsl(222.2, 47.4%, 15%)", // Darker
    "hsl(222.2, 47.4%, 8%)", // Darkest
    "hsl(222.2, 47.4%, 50%)", // Medium
    "hsl(222.2, 25%, 40%)", // Muted
  ];
}

/**
 * Standard chart colors (existing --chart-1 through --chart-5)
 * Provided for reference and backward compatibility
 */
export const standardChartColors: ChartConfig = {
  color1: {
    label: "Chart 1",
    color: "hsl(var(--chart-1))",
  },
  color2: {
    label: "Chart 2",
    color: "hsl(var(--chart-2))",
  },
  color3: {
    label: "Chart 3",
    color: "hsl(var(--chart-3))",
  },
  color4: {
    label: "Chart 4",
    color: "hsl(var(--chart-4))",
  },
  color5: {
    label: "Chart 5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

/**
 * Get standard chart colors as an array
 */
export function getStandardChartColorArray(): string[] {
  return [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];
}

/**
 * Create a ChartConfig from a color array
 * Useful for creating custom color configurations
 */
export function createChartConfigFromColors(
  colors: string[],
  labels?: string[]
): ChartConfig {
  const config: ChartConfig = {};
  colors.forEach((color, index) => {
    const key = `color${index + 1}`;
    config[key] = {
      label: labels?.[index] || `Color ${index + 1}`,
      color,
    };
  });
  return config;
}

/**
 * Color palette type
 */
export type ChartColorPalette = "brand-theme" | "primary-shades" | "standard";

/**
 * Get color palette array based on type
 */
export function getColorPaletteArray(
  type: ChartColorPalette = "standard"
): string[] {
  switch (type) {
    case "brand-theme":
      return getBrandThemeColorArray();
    case "primary-shades":
      return getPrimaryShadesColorArray();
    case "standard":
    default:
      return getStandardChartColorArray();
  }
}

/**
 * Get ChartConfig based on palette type
 */
export function getChartConfigByPalette(
  type: ChartColorPalette = "standard"
): ChartConfig {
  switch (type) {
    case "brand-theme":
      return brandThemeColors;
    case "primary-shades":
      return primaryShadesColors;
    case "standard":
    default:
      return standardChartColors;
  }
}

