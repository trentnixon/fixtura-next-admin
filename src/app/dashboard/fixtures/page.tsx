import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import FixturesOverview from "./_components/FixturesOverview";

export default function FixturesPage() {
  return (
    <>
      <CreatePageTitle
        title="Fixtures"
        byLine="Fixture management"
        byLineBottom="Browse fixture coverage, schedules, and match status across associations"
      />
      <PageContainer padding="xs" spacing="lg">
        <FixturesOverview />
      </PageContainer>
    </>
  );
}
