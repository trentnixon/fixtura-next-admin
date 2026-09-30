import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { ModeCatalogue } from "./components/ModeCatalogue";

export default function TemplateModePage() {
  return (
    <>
      <CreatePageTitle
        title="Mode"
        byLine="Template style"
        byLineBottom="Shared display modes. The renderer uses the slug, or light when the slug is empty."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer title="Modes" description="Name and slug. An empty slug is projected as light.">
          <ModeCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
