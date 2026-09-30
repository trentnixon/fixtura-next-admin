import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AudioCatalogue } from "./components/AudioCatalogue";

export default function TemplateAudioPage() {
  return (
    <>
      <CreatePageTitle
        title="Audio"
        byLine="Template style"
        byLineBottom="Audio options tied to a composition. Create, edit, and delete them here."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Audio options"
          description="Name, source URL, composition id, and component name."
        >
          <AudioCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
