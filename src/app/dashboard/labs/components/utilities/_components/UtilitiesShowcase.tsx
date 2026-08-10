"use client";

import CopyToClipboardShowcase from "./_elements/CopyToClipboardShowcase";
import TimeFormattingShowcase from "./_elements/TimeFormattingShowcase";
import CurrencyFormattingShowcase from "./_elements/CurrencyFormattingShowcase";
import NumberFormattingShowcase from "./_elements/NumberFormattingShowcase";
import SearchComponentsShowcase from "./_elements/SearchComponentsShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Utilities Showcase Component
 *
 * Displays all utility components with examples
 */
export default function UtilitiesShowcase() {
  return (
    <>
      <CopyToClipboardShowcase />
      <TimeFormattingShowcase />
      <CurrencyFormattingShowcase />
      <NumberFormattingShowcase />
      <SearchComponentsShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
