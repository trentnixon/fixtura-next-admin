import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LuminanceCatalogue } from "./components/LuminanceCatalogue";

export default function TemplateLuminancePage() {
  return (
    <>
      <CreatePageTitle
        title="Luminance"
        byLine="Template style"
        byLineBottom="Shared grayscale plates. Many accounts can point at the same row."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Luminance plates"
          description="Name and one media library image. The image URL must be absolute http or https before an account can select the plate."
        >
          <LuminanceCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
