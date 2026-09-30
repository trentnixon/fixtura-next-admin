import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { ImageCatalogue } from "./components/ImageCatalogue";

export default function TemplateImagePage() {
  return (
    <>
      <CreatePageTitle
        title="Image"
        byLine="Template style"
        byLineBottom="Motion and overlay presets. The background photo comes from the account media library."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Background image presets"
          description="No file on this row. Row 1 stays published and cannot be deleted."
        >
          <ImageCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
