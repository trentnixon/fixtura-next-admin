import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { CategoryCatalogue } from "./components/CategoryCatalogue";

export default function TemplateCategoryPage() {
  return (
    <>
      <CreatePageTitle
        title="Category"
        byLine="Template style"
        byLineBottom="Shared layout families. Each row also stores how fixtures are split and which audio bundle plays."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Categories"
          description="Name, slug, fixture-split JSON, privacy, and an audio bundle id. Row 1 stays public and published."
        >
          <CategoryCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
