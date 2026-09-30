import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { PaletteCatalogue } from "./components/PaletteCatalogue";

export default function TemplatePalettePage() {
  return (
    <>
      <CreatePageTitle
        title="Palette"
        byLine="Template style"
        byLineBottom="Shared palette tokens. The renderer receives the value string. Brand colours stay on Theme."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Palettes"
          description="Name and a token value. Row 1 stays published and cannot be deleted."
        >
          <PaletteCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
