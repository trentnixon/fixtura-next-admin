import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { GlobalRenderRollup } from "./components/GlobalRenderRollup";
import { GlobalRenderTable } from "./components/GlobalRenderTable";
import { RenderAnalyticsDashboard } from "./components/RenderAnalyticsDashboard";
import { RenderResourceLeaders } from "./components/RenderResourceLeaders";

export default function Renders() {
  return (
    <>
      <CreatePageTitle title="Renders" byLine="Global Operational Monitoring" />
      <PageContainer padding="xs" spacing="lg">
        <GlobalRenderRollup />
        <RenderAnalyticsDashboard />
        <RenderResourceLeaders />
        <SectionContainer title="Global Operational Audit" description="Real-time rendering activity across the system">
          <GlobalRenderTable />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
