"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import IconSystemShowcase from "../foundation/_components/IconSystemShowcase";

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

      <SectionWrapper spacing="lg" title="Icon System">
        <IconSystemShowcase />
      </SectionWrapper>
    </>
  );
}

