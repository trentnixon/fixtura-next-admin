"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import ListsShowcase from "./_components/ListsShowcase";

/**
 * Lists Category Page
 *
 * List components for displaying ordered and unordered data
 */
export default function ListsPage() {
  return (
    <>
      <CreatePageTitle
        title="Lists"
        byLine="Ordered, unordered, and description lists"
        byLineBottom="Components for displaying list data"
      />

      <PageContainer padding="xs" spacing="lg">
        <ListsShowcase />
      </PageContainer>
    </>
  );
}

