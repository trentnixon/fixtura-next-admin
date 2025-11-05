"use client";

import TextComponentsShowcase from "./_elements/TextComponentsShowcase";
import CodeComponentShowcase from "./_elements/CodeComponentShowcase";
import LinkComponentShowcase from "./_elements/LinkComponentShowcase";
import ParagraphComponentShowcase from "./_elements/ParagraphComponentShowcase";
import BlockquoteComponentShowcase from "./_elements/BlockquoteComponentShowcase";

/**
 * Typography Showcase Component
 *
 * Displays all typography components with examples
 */
export default function TypographyShowcase() {
  return (
    <>
      <TextComponentsShowcase />
      <CodeComponentShowcase />
      <LinkComponentShowcase />
      <ParagraphComponentShowcase />
      <BlockquoteComponentShowcase />
    </>
  );
}
