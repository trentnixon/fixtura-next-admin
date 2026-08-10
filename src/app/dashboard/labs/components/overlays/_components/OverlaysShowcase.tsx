"use client";

import DialogsShowcase from "./_elements/DialogsShowcase";
import SheetsShowcase from "./_elements/SheetsShowcase";
import TooltipsShowcase from "./_elements/TooltipsShowcase";
import DropdownMenusShowcase from "./_elements/DropdownMenusShowcase";
import ComingSoonShowcase from "./_elements/ComingSoonShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Overlays Showcase Component
 *
 * Displays all overlay and modal components with examples
 */
export default function OverlaysShowcase() {
  return (
    <>
      <DialogsShowcase />
      <SheetsShowcase />
      <TooltipsShowcase />
      <DropdownMenusShowcase />
      <ComingSoonShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
