"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import MediaShowcase from "./_components/MediaShowcase";

export default function MediaPage() {
  return (
    <>
      <CategoryLabHeader categoryId="media" />
      <PageContainer padding="xs" spacing="lg">
        <MediaShowcase />
      </PageContainer>
    </>
  );
}
