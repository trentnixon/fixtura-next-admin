import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { TemplateStylePreview } from "./components/TemplateStylePreview";

export default function TemplateStylePreviewPage() {
  return (
    <>
      <CreatePageTitle
        title="Preview"
        byLine="Template style"
        byLineBottom="One Remotion player. The cricket sample fixture supplies the rows. The session style supplies the look. Nothing is saved."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Template style preview"
          description="Starts on the ladder with the new-account style and the ladder theme colours."
        >
          <TemplateStylePreview />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
