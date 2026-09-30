import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { PatternCatalogue } from "./components/PatternCatalogue";

export default function TemplatePatternPage() {
  return (
    <>
      <CreatePageTitle
        title="Pattern"
        byLine="Template style"
        byLineBottom="Shared pattern settings. They are still projected onto a render. Pattern is not a background mode."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Patterns"
          description="Name, type, animation, and the numeric settings. Row 1 stays published and cannot be deleted."
        >
          <PatternCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
