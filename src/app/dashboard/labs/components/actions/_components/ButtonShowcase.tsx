"use client";

import ButtonVariantsShowcase from "./_elements/ButtonVariantsShowcase";
import ButtonSizesShowcase from "./_elements/ButtonSizesShowcase";
import ButtonIconsShowcase from "./_elements/ButtonIconsShowcase";
import ButtonStatesShowcase from "./_elements/ButtonStatesShowcase";
import ButtonGroupsShowcase from "./_elements/ButtonGroupsShowcase";
import ButtonFullWidthShowcase from "./_elements/ButtonFullWidthShowcase";
import ButtonUsageGuidelinesShowcase from "./_elements/ButtonUsageGuidelinesShowcase";

/**
 * Button Showcase Component
 *
 * Displays all button variants, sizes, and states with examples
 */
export default function ButtonShowcase() {
  return (
    <>
      <ButtonVariantsShowcase />
      <ButtonSizesShowcase />
      <ButtonIconsShowcase />
      <ButtonStatesShowcase />
      <ButtonGroupsShowcase />
      <ButtonFullWidthShowcase />
      <ButtonUsageGuidelinesShowcase />
    </>
  );
}
