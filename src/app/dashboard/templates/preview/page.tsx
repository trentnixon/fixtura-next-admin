import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
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
        <TemplateStylePreview />
      </PageContainer>
    </>
  );
}
