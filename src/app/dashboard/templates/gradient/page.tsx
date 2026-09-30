import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { GradientCatalogue } from "./components/GradientCatalogue";

export default function TemplateGradientPage() {
  return (
    <>
      <CreatePageTitle
        title="Gradient"
        byLine="Template style"
        byLineBottom="Shared background gradients. Editing one changes every account that points at it."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Background gradients"
          description="Name, type, and direction. Row 1 stays published and cannot be deleted."
        >
          <GradientCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
