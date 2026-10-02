import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { OptionCatalogue } from "./components/OptionCatalogue";

export default function TemplateOptionPage() {
  return (
    <>
      <CreatePageTitle
        title="Style option"
        byLine="Template style"
        byLineBottom="One row per account. It stores the active background and the catalogue ids. It does not store the colours or files."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Style options"
          description="Each account already has one row. This page only shows the active background and the catalogue ids it points at."
        >
          <OptionCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
