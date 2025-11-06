// TODO: Add a page that shows all the renders for an account
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

export default function Renders() {
  return (
    <>
      <CreatePageTitle title="Renders" byLine="All Renders" />
      <PageContainer padding="xs" spacing="lg">
        <ElementContainer title="Renders" subtitle="All Renders">
          Render Table
        </ElementContainer>
      </PageContainer>
    </>
  );
}
