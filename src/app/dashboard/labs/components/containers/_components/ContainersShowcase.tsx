"use client";

import ContainerPatternsShowcase from "./_elements/ContainerPatternsShowcase";
import PageContainerShowcase from "./_elements/PageContainerShowcase";
import SectionContainerShowcase from "./_elements/SectionContainerShowcase";
import ElementContainerShowcase from "./_elements/ElementContainerShowcase";
import ContainerHierarchyShowcase from "./_elements/ContainerHierarchyShowcase";

/**
 * Containers showcase - page, section, and element wrapper examples
 */
export default function ContainersShowcase() {
  return (
    <>
      <ContainerPatternsShowcase />
      <PageContainerShowcase />
      <SectionContainerShowcase />
      <ElementContainerShowcase />
      <ContainerHierarchyShowcase />
    </>
  );
}
