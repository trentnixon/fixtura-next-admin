import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CompetitionAdminStats from "./components/CompetitionAdminStats";

export default function Competitions() {
  return (
    <>
      <CreatePageTitle
        title="Competitions"
        byLine="CMS-powered competition dashboard"
        byLineBottom="Monitor competition activity, timing, and size across associations and seasons"
      />
      <PageContainer padding="xs" spacing="lg">
        <CompetitionAdminStats />
      </PageContainer>
    </>
  );
}
