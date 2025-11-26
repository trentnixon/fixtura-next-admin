import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import FixturesOverview from "./_components/FixturesOverview";

export default function FixturesPage() {
    return (
        <>
            <CreatePageTitle
                title="Fixtures"
                byLine="Fixture & Game Management"
                byLineBottom="View and manage all fixtures, games, and match schedules across competitions"
            />
            <PageContainer padding="xs" spacing="lg">
                <FixturesOverview />
            </PageContainer>
        </>
    );
}
