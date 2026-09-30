import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { ThemeCatalogue } from "./components/ThemeCatalogue";

export default function BrandThemePage() {
  return (
    <>
      <CreatePageTitle
        title="Theme"
        byLine="Brand colours"
        byLineBottom="Shared brand themes. The colour JSON is primary, secondary, dark, and white."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Themes"
          description="Name, the four brand colours, and whether the theme is public. Palette tokens stay on a different catalogue."
        >
          <ThemeCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
