"use client";

import SemanticColorsShowcase from "./_elements/SemanticColorsShowcase";
import SemanticPalettesShowcase from "./_elements/SemanticPalettesShowcase";
import BrandColorsShowcase from "./_elements/BrandColorsShowcase";
import BrandPalettesShowcase from "./_elements/BrandPalettesShowcase";
import AdditionalPalettesShowcase from "./_elements/AdditionalPalettesShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Color System Showcase Component
 *
 * Displays comprehensive color system documentation and examples
 */
export default function ColorSystemShowcase() {
  return (
    <>
      <SemanticColorsShowcase />
      <SemanticPalettesShowcase />
      <BrandColorsShowcase />
      <BrandPalettesShowcase />
      <AdditionalPalettesShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
