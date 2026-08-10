"use client";

import GridShowcase from "./_elements/GridShowcase";
import FlexShowcase from "./_elements/FlexShowcase";
import DividersShowcase from "./_elements/DividersShowcase";
import SpacingSystemShowcase from "./_elements/SpacingSystemShowcase";

/**
 * Layouts showcase — grid, flex, divider, and spacing patterns
 */
export default function LayoutsShowcase() {
  return (
    <>
      <GridShowcase />
      <FlexShowcase />
      <DividersShowcase />
      <SpacingSystemShowcase />
    </>
  );
}
