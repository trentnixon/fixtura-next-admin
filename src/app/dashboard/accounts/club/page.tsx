import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import DisplayClubsTable from "./components/ClubsTable";

export default function ClubsPage() {
  return (
    <>
      <CreatePageTitle
        title="Club Accounts"
        byLine="View, manage, and search all club accounts"
        byLineBottom="Includes club status, contact info, and management tools"
      />
      <PageContainer padding="xs" spacing="lg">
        <DisplayClubsTable />
      </PageContainer>
    </>
  );
}
