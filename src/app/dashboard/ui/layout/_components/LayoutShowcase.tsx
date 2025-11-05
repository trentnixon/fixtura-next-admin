"use client";
import ContainersShowcase from "./_elements/ContainersShowcase";
import GridShowcase from "./_elements/GridShowcase";
import FlexShowcase from "./_elements/FlexShowcase";
import DividersShowcase from "./_elements/DividersShowcase";

/**
 * Layout Showcase Component
 *
 * Displays all layout components with examples
 */
export default function LayoutShowcase() {
  return (
    <>
      <ContainersShowcase />
      <GridShowcase />
      <FlexShowcase />
      <DividersShowcase />
    </>
  );
}
