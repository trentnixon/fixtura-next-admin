import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AnimationCatalogue } from "./components/AnimationCatalogue";

export default function TemplateAnimationPage() {
  return (
    <>
      <CreatePageTitle
        title="Animation"
        byLine="Template style"
        byLineBottom="Shared animation presets. The discovery sync can overwrite configuration, visibility, and the default flag."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Animation presets"
          description="Preset id, name, catalogue version, and the two JSON fields are required."
        >
          <AnimationCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
