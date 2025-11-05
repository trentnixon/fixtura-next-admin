"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import ColorSystemShowcase from "./_components/ColorSystemShowcase";

/**
 * Colors Category Page
 *
 * Color system and palette
 */
export default function ColorsPage() {
  return (
    <>
      <CreatePageTitle
        title="Colors"
        byLine="Color System & Palette"
        byLineBottom="Semantic colors, color scales, and usage guidelines"
      />

      <PageContainer padding="xs" spacing="lg">
        <ColorSystemShowcase />
      </PageContainer>
    </>
  );
}
