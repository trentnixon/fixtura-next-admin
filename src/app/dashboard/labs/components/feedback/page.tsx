"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CategoryLabHeader from "../_components/CategoryLabHeader";
import FeedbackShowcase from "./_components/FeedbackShowcase";

export default function FeedbackPage() {
  return (
    <>
      <CategoryLabHeader categoryId="feedback" />
      <PageContainer padding="xs" spacing="lg">
        <FeedbackShowcase />
      </PageContainer>
    </>
  );
}
