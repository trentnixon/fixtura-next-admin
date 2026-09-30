import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { TextureCatalogue } from "./components/TextureCatalogue";

export default function TemplateTexturePage() {
  return (
    <>
      <CreatePageTitle
        title="Texture"
        byLine="Template style"
        byLineBottom="Shared texture images and how they blend. The file already lives in the media library."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Textures"
          description="Name, category, opacity, and one media library image. Blend mode is multiply."
        >
          <TextureCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
