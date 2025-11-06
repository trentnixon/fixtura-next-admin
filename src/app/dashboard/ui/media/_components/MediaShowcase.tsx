"use client";

import ImagesShowcase from "./_elements/ImagesShowcase";
import VideosShowcase from "./_elements/VideosShowcase";
import CodeBlocksShowcase from "./_elements/CodeBlocksShowcase";
import MarkdownShowcase from "./_elements/MarkdownShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Media Showcase Component
 *
 * Displays all media and content components with examples
 */
export default function MediaShowcase() {
  return (
    <>
      <ImagesShowcase />
      <VideosShowcase />
      <CodeBlocksShowcase />
      <MarkdownShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
