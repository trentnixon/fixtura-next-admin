"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import ListsShowcase from "./_components/ListsShowcase";

export default function ListsPage() {
  return (
    <>
      <CategoryLabHeader categoryId="lists" />
      <PageContainer padding="xs" spacing="lg">
        <ListsShowcase />
      </PageContainer>
    </>
  );
}
