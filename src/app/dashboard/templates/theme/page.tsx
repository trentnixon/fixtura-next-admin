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
        byLineBottom="Account brand themes. This page only shows them."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Themes"
          description="Primary, secondary, dark, and white for each account theme. Palette tokens stay on a different catalogue."
        >
          <ThemeCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
