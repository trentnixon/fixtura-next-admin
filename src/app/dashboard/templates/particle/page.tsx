import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { ParticleCatalogue } from "./components/ParticleCatalogue";

export default function TemplateParticlePage() {
  return (
    <>
      <CreatePageTitle
        title="Particle"
        byLine="Template style"
        byLineBottom="Shared particle settings. They are still projected onto a render. Particle is not a background mode."
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Particles"
          description="Name, type, count, speed, direction, and animation. Row 1 stays published and cannot be deleted."
        >
          <ParticleCatalogue />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
