"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import ButtonShowcase from "./_components/ButtonShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

/**
 * Actions Category Page
 *
 * Buttons, Button Groups, Floating Actions components
 */
export default function ActionsPage() {
  return (
    <>
      <CreatePageTitle
        title="Actions & Controls"
        byLine="Buttons, Button Groups, Floating Actions"
        byLineBottom="Action and control components"
      />

      <PageContainer padding="xs" spacing="lg">
        <ButtonShowcase />
      </PageContainer>
    </>
  );
}
