"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import IconSystemShowcase from "./_components/IconSystemShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

/**
 * Icons Category Page
 *
 * Icon library and usage
 */
export default function IconsPage() {
  return (
    <>
      <CreatePageTitle
        title="Icons"
        byLine="Icon Library & Usage"
        byLineBottom="Lucide React icons, sizes, and variants"
      />

      <PageContainer padding="xs" spacing="lg">
        <IconSystemShowcase />
      </PageContainer>
    </>
  );
}
