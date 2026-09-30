import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { NoiseCatalogue } from "./components/NoiseCatalogue";

export default function TemplateNoisePage() {
  return (
    <>
      <CreatePageTitle
        title="Noise"
        byLine="Template style"
        byLineBottom="Shared background noise rows. Editing one changes every account that points at it."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Background noise"
          description="Name and noise type. Row 1 stays published and cannot be deleted."
        >
          <NoiseCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
