"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import MediaShowcase from "./_components/MediaShowcase";

/**
 * Media Category Page
 *
 * Images, Videos, Code Blocks, Markdown components
 */
export default function MediaPage() {
  return (
    <>
      <CreatePageTitle
        title="Media & Content"
        byLine="Images, Videos, Code Blocks, Markdown"
        byLineBottom="Media and content display components"
      />

      <PageContainer padding="xs" spacing="lg">
        <MediaShowcase />
      </PageContainer>
    </>
  );
}
